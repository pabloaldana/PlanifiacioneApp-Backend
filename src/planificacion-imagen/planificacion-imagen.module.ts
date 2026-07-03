import { Module } from '@nestjs/common';
import { PlanificacionImagenService } from './planificacion-imagen.service';
import { PlanificacionImagenController } from './planificacion-imagen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanificacionImagen } from './entities/planificacion-imagen.entity';
import { FilesModule } from 'src/files/files.module';
import { PlanificacionModule } from 'src/planificacion/planificacion.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PlanificacionImagenController],
  providers: [PlanificacionImagenService],
  imports: [
    TypeOrmModule.forFeature([PlanificacionImagen]),
    FilesModule,
    AuthModule,
    PlanificacionModule,
  ]
})
export class PlanificacionImagenModule {}