import * as crypto from 'crypto';
import { Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { CompraService } from '../compra/compra.service';
import { User } from '../auth/entities/auth.entity';
import { PaymentStatus } from '../compra/entities/compra.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject('MERCADO_PAGO')
    private readonly mpClient: MercadoPagoConfig,
    private readonly compraService: CompraService,
    private readonly configService: ConfigService,
  ) { }

  async createPreference(
    data: { title: string; price: number; idPlanificacion: number },
    user: User,
  ) {
    // 1. Crear la compra en pending ANTES de ir a Mercado Pago
    const compra = await this.compraService.create({
      userId: user.id,
      planificacionId: data.idPlanificacion,
      priceAtPurchase: data.price,
      paymentMethod: 'mercadopago',
      paymentStatus: PaymentStatus.PENDING,
    });

    // 2. Crear la preferencia usando el ID de la compra como referencia externa
    const preference = new Preference(this.mpClient);
    const notificationUrl = this.configService.get<string>('MP_NOTIFICATION_URL');

    const result = await preference.create({
      body: {
        items: [
          {
            id: String(data.idPlanificacion),
            title: data.title,
            quantity: 1,
            unit_price: data.price,
          },
        ],
        external_reference: compra.id,
        back_urls: {
          success: this.configService.get('MP_BACK_URL_SUCCESS') ?? 'http://localhost:3000/success',
          pending: this.configService.get('MP_BACK_URL_PENDING') ?? 'http://localhost:3000/pending',
          failure: this.configService.get('MP_BACK_URL_FAILURE') ?? 'http://localhost:3000/failure',
        },
        auto_return: 'approved',
        ...(notificationUrl && { notification_url: notificationUrl }),
      },
    });

    return {
      compraId: compra.id,
      preferenceId: result.id,
      init_point: result.init_point,
    };
  }

  async processWebhook(body: any, signature: string, requestId: string) {
    this.logger.log(`Webhook recibido — type: ${body?.type}, action: ${body?.action}`);

    this.validateSignature(body, signature, requestId);

    const isPaymentEvent =
      body?.type === 'payment' || body?.action === 'payment.updated';

    if (!isPaymentEvent) {
      this.logger.log(`Evento ignorado: type=${body?.type}, action=${body?.action}`);
      return { received: true };
    }

    const paymentId = body?.data?.id;
    if (!paymentId) {
      this.logger.warn('Webhook de pago recibido sin data.id');
      return { received: true };
    }

    try {
      const payment = await new Payment(this.mpClient).get({ id: paymentId });
      this.logger.log(`Pago ${paymentId} — status: ${payment.status}`);

      const compraId = payment.external_reference;
      if (!compraId) {
        this.logger.warn(`Pago ${paymentId} sin external_reference — se ignora`);
        return { received: true };
      }

      if (payment.status === 'approved') {
        await this.compraService.updateCompraAfterPayment(compraId, String(paymentId), 'paid');
        this.logger.log(`Compra ${compraId} marcada como paid (transactionId: ${paymentId})`);
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        await this.compraService.updateCompraAfterPayment(compraId, String(paymentId), 'failed');
        this.logger.log(`Compra ${compraId} marcada como failed (transactionId: ${paymentId})`);
      }
    } catch (error) {
      this.logger.error(`Error procesando pago ${paymentId}`, error);
      throw error;
    }

    return { received: true };
  }

  private validateSignature(body: any, signature: string, requestId: string): void {
    const secret = process.env.MP_WEBHOOK_SECRET;

    if (!secret) {
      this.logger.warn('MP_WEBHOOK_SECRET no definido — omitiendo validación de firma (dev mode)');
      return;
    }

    if (!signature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const parts = Object.fromEntries(
      signature.split(',').map((part) => part.split('=')),
    );
    const ts = parts['ts'];
    const v1 = parts['v1'];

    if (!ts || !v1) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const manifest = `id:${body?.data?.id};request-id:${requestId};ts:${ts}`;
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    if (expectedHash !== v1) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
