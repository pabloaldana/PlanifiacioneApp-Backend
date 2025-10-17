import { Module } from '@nestjs/common';
import { ArchivoService } from './archivo.service';
import { ArchivoController } from './archivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archivo } from './entities/archivo.entity';

@Module({
  controllers: [ArchivoController],
  providers: [ArchivoService],
  imports:[TypeOrmModule.forFeature([Archivo])]
})
export class ArchivoModule {}
