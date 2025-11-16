import { Module } from '@nestjs/common';


import { MateriaModule } from './materia/materia.module';
import { GradoModule } from './grado/grado.module';
import { PlanificacionModule } from './planificacion/planificacion.module';


import { DescargaModule } from './descarga/descarga.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComentarioModule } from './comentario/comentario.module';

import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { CompraModule } from './compra/compra.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432, // default to 5432 if undefined
      database:process.env.DB_NAME,
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize:true,
    }),

    MateriaModule, GradoModule, PlanificacionModule, DescargaModule, ComentarioModule, FilesModule, AuthModule, CompraModule, SeedModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {}
