import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Planificacion } from 'src/planificacion/entities/planificacion.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,
        @InjectRepository(Planificacion)
        private readonly planificacionRepository: Repository<Planificacion>,
    ) {}

    async getMyCart(user: User): Promise<Cart> {
        return this.getOrCreate(user);
    }

    async addItem(user: User, dto: AddCartItemDto): Promise<Cart> {
        const cart = await this.getOrCreate(user);

        const planificacion = await this.planificacionRepository.findOneBy({ id: dto.planificacionId });
        if (!planificacion) throw new NotFoundException(`Planificación #${dto.planificacionId} no encontrada`);

        const alreadyInCart = cart.items?.some(item => item.planificacion.id === dto.planificacionId);
        if (alreadyInCart) throw new BadRequestException('Esta planificación ya está en el carrito');

        const item = this.cartItemRepository.create({ cart, planificacion, priceAtAdded: planificacion.price });
        await this.cartItemRepository.save(item);

        return this.getOrCreate(user);
    }

    async removeItem(user: User, planificacionId: number): Promise<Cart> {
        const cart = await this.getOrCreate(user);

        const item = cart.items?.find(i => i.planificacion.id === planificacionId);
        if (!item) throw new NotFoundException('Item no encontrado en el carrito');

        await this.cartItemRepository.remove(item);
        return this.getOrCreate(user);
    }

    async clearCart(user: User): Promise<void> {
        const cart = await this.getOrCreate(user);
        await this.cartItemRepository.remove(cart.items ?? []);
    }

    private async getOrCreate(user: User): Promise<Cart> {
        let cart = await this.cartRepository.findOne({ where: { user: { id: user.id } } });

        if (!cart) {
            cart = this.cartRepository.create({ user });
            await this.cartRepository.save(cart);
        }

        return cart;
    }
}
