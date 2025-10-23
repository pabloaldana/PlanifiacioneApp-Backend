import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol.module';
import { MateriaModule } from './materia/materia.module';
import { GradoModule } from './grado/grado.module';
import { PlanificacionModule } from './planificacion/planificacion.module';
import { OrdenModule } from './orden/orden.module';
import { OrdenItemModule } from './orden-item/orden-item.module';
import { CarritoModule } from './carrito/carrito.module';
import { CarritoItemModule } from './carrito-item/carrito-item.module';
import { DescargaModule } from './descarga/descarga.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivoModule } from './archivo/archivo.module';
import { ComentarioModule } from './comentario/comentario.module';
import { SuscripcionModule } from './suscripcion/suscripcion.module';

import { FilesModule } from './files/files.module';




@Module({
  imports: [
    ConfigModule.forRoot(),
    
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

    UsuarioModule, RolModule, MateriaModule, GradoModule, PlanificacionModule, OrdenModule, OrdenItemModule, CarritoModule, CarritoItemModule, DescargaModule, ArchivoModule, ComentarioModule, SuscripcionModule, FilesModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {}
