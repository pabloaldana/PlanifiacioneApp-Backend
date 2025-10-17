import { Module } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscripcion } from './entities/suscripcion.entity';

@Module({
  controllers: [SuscripcionController],
  providers: [SuscripcionService],
  imports: [TypeOrmModule.forFeature([Suscripcion])]
})
export class SuscripcionModule {}
