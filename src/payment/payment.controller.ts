import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // Endpoint para crear preferencia (devolver link de pago)
  @Post('create-preference')
  createPreference(@Body() body: { title: string; price: number, idPlanificacion: string }) {
    return this.paymentService.createPreference(body);
  }

  @Post('webhook')
  processWebhook(
    @Body() body: any,
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
  ) {
    return this.paymentService.processWebhook(body, signature, requestId);
  }
}
