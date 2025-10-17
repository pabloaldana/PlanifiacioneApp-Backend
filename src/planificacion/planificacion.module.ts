import { Module } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { PlanificacionController } from './planificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planificacion } from './entities/planificacion.entity';

@Module({
  controllers: [PlanificacionController],
  providers: [PlanificacionService],
  imports:[TypeOrmModule.forFeature([Planificacion])]

})
export class PlanificacionModule {}
