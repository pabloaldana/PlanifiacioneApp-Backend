import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoProvider } from './helpers/mp.provider';
import { CompraModule } from '../compra/compra.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, MercadoPagoProvider],
  imports: [ConfigModule, CompraModule, AuthModule],
})
export class PaymentsModule { }