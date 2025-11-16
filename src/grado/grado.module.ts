import { Module } from '@nestjs/common';
import { GradoService } from './grado.service';
import { GradoController } from './grado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grado } from './entities/grado.entity';

@Module({
  controllers: [GradoController],
  providers: [GradoService],
  imports:[TypeOrmModule.forFeature([Grado])],
  exports:[TypeOrmModule,GradoService]
})
export class GradoModule {}
