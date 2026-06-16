import { Module } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './entities/materia.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MateriaController],
  providers: [MateriaService],
  imports: [TypeOrmModule.forFeature([Materia]), AuthModule],
  exports: [TypeOrmModule, MateriaService]
})
export class MateriaModule { }
