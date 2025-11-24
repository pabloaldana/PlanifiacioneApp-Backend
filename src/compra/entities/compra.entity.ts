import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Planificacion } from 'src/planificacion/entities/planificacion.entity';
import { User } from 'src/auth/entities/auth.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  

  // --- Relaciones ---
  @ManyToOne(() => User, (user) => user.compras, { eager: false })
  user: User;

  @ManyToOne(() => Planificacion, (planificacion) => planificacion.compras, {
    eager: true,
  })
  planificacion: Planificacion;

  // --- Datos importantes de la compra ---
  
  // Precio congelado al momento de la compra
  @Column('decimal', { precision: 10, scale: 2 })
  priceAtPurchase: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod: string;

  // ID externo del pago (Stripe, MercadoPago, etc.)
  @Column({ type: 'varchar', nullable: true })
  transactionId: string;

//   // En caso de necesitar registrar algún descuento aplicado
//   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//   discountApplied: number;

  // Registro de fechas
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


//todo: tiene id_usuario(comprador), id_planifiacion, 