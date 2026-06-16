import { Module } from '@nestjs/common';
import { GradoService } from './grado.service';
import { GradoController } from './grado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grado } from './entities/grado.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GradoController],
  providers: [GradoService],
  imports: [TypeOrmModule.forFeature([Grado]), AuthModule],
  exports: [TypeOrmModule, GradoService]
})
export class GradoModule { }
