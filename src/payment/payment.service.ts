import { Injectable, Inject, Logger } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject('MERCADO_PAGO')
    private readonly mpClient: MercadoPagoConfig,
  ) { }

  /**
   * Crear preferencia de pago (esto se llama desde tu endpoint)
   */
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
      init_point: result.init_point, // LINK PARA REDIRECCIONAR AL PAGO
    };
  }

  /**
   * Webhook que MercadoPago llama automáticamente
   */
  async processWebhook(body: any, signature: string, requestId: string) {
    this.logger.debug('📩 Webhook recibido');
    this.logger.debug('Body:', body);
    this.logger.debug('Signature:', signature);
    this.logger.debug('Request-ID:', requestId);

    // Aquí procesás los datos del webhook
    // ------------------------------------------------------
    // Ejemplo de flujo:
    // 1. body.data.id → es el pagoId
    // 2. Consultar el pago usando MercadoPagoAPI
    // 3. Validar si el pago está APPROVED
    // 4. Crear la compra en tu base de datos
    // ------------------------------------------------------

    return { received: true };
  }
}
