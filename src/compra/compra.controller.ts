import { Controller, Get, Post, Body } from '@nestjs/common';
import { CompraService } from './compra.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/auth.entity';

@Controller('compras')
export class CompraController {
  constructor(private readonly compraService: CompraService) { }


  @Get('/mias')
  @Auth(ValidRoles.user) //si no viene nada es para todos
  findMyPurchases(@GetUser() user: User) {
    // console.log(user)
    return this.compraService.findMyPurchases(user);
  }

  @Get()
  @Auth(ValidRoles.superAdmin)
  findAllPurchases() {
    return this.compraService.findAllPurchases()
  }

}
