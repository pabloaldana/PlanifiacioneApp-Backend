import { User } from 'src/auth/entities/auth.entity';
import { CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => User, { eager: false })
    @JoinColumn()
    user!: User;

    @OneToMany(() => CartItem, item => item.cart, { eager: true, cascade: true })
    items!: CartItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
