import { Module } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { ComentarioController } from './comentario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  controllers: [ComentarioController],
  providers: [ComentarioService],
  imports: [TypeOrmModule.forFeature([Comentario,Usuario])],
})
export class ComentarioModule {}
