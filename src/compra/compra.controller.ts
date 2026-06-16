import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CompraService } from './compra.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/auth.entity';

@Controller('compras')
export class CompraController {
  constructor(private readonly compraService: CompraService) { }

  @Get('/mias')
  @Auth(ValidRoles.user)
  findMyPurchases(@GetUser() user: User) {
    return this.compraService.findMyPurchases(user);
  }

  @Get('/tengo/:planificacionId')
  @Auth(ValidRoles.user)
  hasPurchased(
    @GetUser() user: User,
    @Param('planificacionId', ParseIntPipe) planificacionId: number,
  ) {
    return this.compraService.hasPurchased(user.id, planificacionId);
  }

  @Get()
  @Auth(ValidRoles.superAdmin)
  findAllPurchases() {
    return this.compraService.findAllPurchases();
  }
}
