import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoProvider } from './helpers/mp.provider';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService,MercadoPagoProvider],
  imports:[ConfigModule]
})
export class PaymentsModule {}