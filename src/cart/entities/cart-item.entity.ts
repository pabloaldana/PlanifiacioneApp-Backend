import { Planificacion } from 'src/planificacion/entities/planificacion.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
    cart!: Cart;

    @ManyToOne(() => Planificacion, { eager: true })
    planificacion!: Planificacion;

    @Column('decimal', { precision: 10, scale: 2 })
    priceAtAdded!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
