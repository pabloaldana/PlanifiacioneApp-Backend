import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { PaymentStatus } from '../entities/compra.entity';

export class CreateCompraDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  planificacionId!: string;

  // Precio congelado en el momento de la compra
  @IsNumber()
  @IsNotEmpty()
  priceAtPurchase!: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  // Si querés permitir que el frontend envíe el estado (normalmente NO conviene)
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;
}
