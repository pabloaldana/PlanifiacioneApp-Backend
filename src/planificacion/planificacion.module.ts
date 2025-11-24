import { Module } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { PlanificacionController } from './planificacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planificacion } from './entities/planificacion.entity';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { PassportModule } from '@nestjs/passport';


@Module({
  controllers: [PlanificacionController],
  providers: [PlanificacionService,FilesService,AuthService],
  imports:[
    TypeOrmModule.forFeature([Planificacion]),
    FilesModule,
    AuthModule,
    PassportModule
  ]

})
export class PlanificacionModule {}
