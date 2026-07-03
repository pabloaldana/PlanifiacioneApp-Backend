import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PlanificacionModule } from 'src/planificacion/planificacion.module';
import { CompraModule } from 'src/compra/compra.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [AuthModule, PlanificacionModule, CompraModule],
})
export class DashboardModule {}
