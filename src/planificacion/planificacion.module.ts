import { Module } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { PlanificacionController } from './planificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planificacion } from './entities/planificacion.entity';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { CompraModule } from 'src/compra/compra.module';


@Module({
  controllers: [PlanificacionController],
  providers: [PlanificacionService],
  exports: [PlanificacionService],
  imports:[
    TypeOrmModule.forFeature([Planificacion]),
    FilesModule,
    AuthModule,
    PassportModule,
    CompraModule,
  ]

})
export class PlanificacionModule {}
