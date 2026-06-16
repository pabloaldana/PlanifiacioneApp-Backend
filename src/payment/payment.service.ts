import * as crypto from 'crypto';
import { BadRequestException, Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { CompraService } from '../compra/compra.service';
import { CartService } from '../cart/cart.service';
import { User } from '../auth/entities/auth.entity';
import { PaymentStatus } from '../compra/entities/compra.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject('MERCADO_PAGO')
    private readonly mpClient: MercadoPagoConfig,
    private readonly compraService: CompraService,
    private readonly cartService: CartService,
    private readonly configService: ConfigService,
  ) { }

  async createPreference(user: User) {
    // 1. Buscar el carrito del usuario — un usuario tiene un solo carrito
    const cart = await this.cartService.getMyCart(user);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    // 2. Crear una Compra por cada item — precio viene de priceAtAdded, nunca del cliente
    const compras = await Promise.all(
      cart.items.map((item) =>
        this.compraService.create({
          userId: user.id,
          planificacionId: item.planificacion.id,
          priceAtPurchase: item.priceAtAdded,
          paymentMethod: 'mercadopago',
          paymentStatus: PaymentStatus.PENDING,
        }),
      ),
    );

    // 3. external_reference agrupa todos los IDs de compras separados por coma
    const externalReference = compras.map((c) => c.id).join(',');

    const preference = new Preference(this.mpClient);
    const notificationUrl = this.configService.get<string>('MP_NOTIFICATION_URL');
    const backUrlSuccess = this.configService.get<string>('MP_BACK_URL_SUCCESS');
    const backUrlPending = this.configService.get<string>('MP_BACK_URL_PENDING');
    const backUrlFailure = this.configService.get<string>('MP_BACK_URL_FAILURE');
    const hasBackUrls = backUrlSuccess && backUrlPending && backUrlFailure;

    const result = await preference.create({
      body: {
        items: cart.items.map((item) => ({
          id: String(item.planificacion.id),
          title: item.planificacion.title,
          quantity: 1,
          unit_price: Number(item.priceAtAdded),
        })),
        external_reference: externalReference,
        ...(hasBackUrls && {
          back_urls: {
            success: backUrlSuccess,
            pending: backUrlPending,
            failure: backUrlFailure,
          },
          auto_return: 'approved',
        }),
        ...(notificationUrl && { notification_url: notificationUrl }),
      },
    });

    // 4. Vaciar el carrito — el usuario ya inició el proceso de pago
    await this.cartService.clearCart(user);

    return {
      compraIds: compras.map((c) => c.id),
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

      const externalReference = payment.external_reference;
      if (!externalReference) {
        this.logger.warn(`Pago ${paymentId} sin external_reference — se ignora`);
        return { received: true };
      }

      const compraIds = externalReference.split(',');

      if (payment.status === 'approved') {
        await Promise.all(
          compraIds.map((compraId) =>
            this.compraService.updateCompraAfterPayment(compraId, String(paymentId), 'paid'),
          ),
        );
        this.logger.log(`${compraIds.length} compra(s) marcadas como paid (transactionId: ${paymentId})`);
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        await Promise.all(
          compraIds.map((compraId) =>
            this.compraService.updateCompraAfterPayment(compraId, String(paymentId), 'failed'),
          ),
        );
        this.logger.log(`${compraIds.length} compra(s) marcadas como failed (transactionId: ${paymentId})`);
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
