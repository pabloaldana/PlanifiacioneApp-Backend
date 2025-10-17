import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { Comentario } from 'src/comentario/entities/comentario.entity';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  imports:[
    TypeOrmModule.forFeature([Usuario,Rol,Comentario])
  ],
})
export class UsuarioModule {}
