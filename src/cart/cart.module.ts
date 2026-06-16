import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Planificacion } from 'src/planificacion/entities/planificacion.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, CartItem, Planificacion]),
        AuthModule,
        PassportModule,
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule {}
