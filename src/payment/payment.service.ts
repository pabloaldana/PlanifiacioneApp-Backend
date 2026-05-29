import * as crypto from 'crypto';
import { Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { CompraService } from '../compra/compra.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject('MERCADO_PAGO')
    private readonly mpClient: MercadoPagoConfig,
    private readonly compraService: CompraService,
  ) { }

  async createPreference(data: { title: string; price: number, idPlanificacion: string }) {
    const preference = new Preference(this.mpClient);

    const preferenceBody = {
      items: [
        {
          id: data.idPlanificacion,
          title: data.title,
          quantity: 1,
          unit_price: data.price,
        },
      ],
      back_urls: {
        success: 'https://tusitio.com/success',
        pending: 'https://tusitio.com/pending',
        failure: 'https://tusitio.com/failure',
      },
      auto_return: 'approved',
      notification_url: 'https://tusitio.com/payments/webhook',
    };

    const result = await preference.create({ body: preferenceBody });

    return {
      id: result.id,
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

      if (payment.status === 'approved') {
        await this.compraService.updatePaymentStatus(String(paymentId), 'paid');
        this.logger.log(`Compra con transactionId ${paymentId} marcada como paid`);
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        await this.compraService.updatePaymentStatus(String(paymentId), 'failed');
        this.logger.log(`Compra con transactionId ${paymentId} marcada como failed`);
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

    // Parsear ts y v1 del header: "ts=<timestamp>,v1=<hash>"
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
