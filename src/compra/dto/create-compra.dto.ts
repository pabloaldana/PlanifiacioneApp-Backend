import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, IsInt, IsPositive } from 'class-validator';
import { PaymentStatus } from '../entities/compra.entity';

export class CreateCompraDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  // Planificacion.id es un entero autoincremental, no un UUID
  @IsInt()
  @IsPositive()
  planificacionId!: number;

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
