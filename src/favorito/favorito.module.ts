import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritoController } from './favorito.controller';
import { FavoritoService } from './favorito.service';
import { Favorito } from './entities/favorito.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([Favorito]),
        AuthModule,
        PassportModule,
    ],
    controllers: [FavoritoController],
    providers: [FavoritoService],
})
export class FavoritoModule {}
