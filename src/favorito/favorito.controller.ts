import { Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FavoritoService } from './favorito.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/auth.entity';

@Controller('favoritos')
@Auth()
export class FavoritoController {

    constructor(private readonly favoritoService: FavoritoService) {}

    @Post(':planificacionId')
    add(
        @Param('planificacionId', ParseIntPipe) planificacionId: number,
        @GetUser() user: User,
    ) {
        return this.favoritoService.add(planificacionId, user);
    }

    @Delete(':planificacionId')
    remove(
        @Param('planificacionId', ParseIntPipe) planificacionId: number,
        @GetUser() user: User,
    ) {
        return this.favoritoService.remove(planificacionId, user);
    }

    @Get()
    findAll(@GetUser() user: User) {
        return this.favoritoService.findAllByUser(user);
    }

    @Get('check/:planificacionId')
    check(
        @Param('planificacionId', ParseIntPipe) planificacionId: number,
        @GetUser() user: User,
    ) {
        return this.favoritoService.isFavorito(planificacionId, user);
    }
}
