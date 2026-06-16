import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/auth.entity';

@Controller('cart')
@Auth(ValidRoles.user)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    getMyCart(@GetUser() user: User) {
        return this.cartService.getMyCart(user);
    }

    @Post('items')
    addItem(@GetUser() user: User, @Body() dto: AddCartItemDto) {
        return this.cartService.addItem(user, dto);
    }

    @Delete('items/:planificacionId')
    removeItem(
        @GetUser() user: User,
        @Param('planificacionId', ParseIntPipe) planificacionId: number,
    ) {
        return this.cartService.removeItem(user, planificacionId);
    }

    @Delete()
    clearCart(@GetUser() user: User) {
        return this.cartService.clearCart(user);
    }
}
