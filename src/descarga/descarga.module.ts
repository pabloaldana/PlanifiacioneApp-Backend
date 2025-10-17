import { Module } from '@nestjs/common';
import { DescargaService } from './descarga.service';
import { DescargaController } from './descarga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Descarga } from './entities/descarga.entity';

@Module({
  controllers: [DescargaController],
  providers: [DescargaService],
  imports: [TypeOrmModule.forFeature([Descarga])]
})
export class DescargaModule {}
