import { Module } from '@nestjs/common';


import { MateriaModule } from './materia/materia.module';
import { GradoModule } from './grado/grado.module';
import { PlanificacionModule } from './planificacion/planificacion.module';
import { PlanificacionImagenModule } from './planificacion-imagen/planificacion-imagen.module';


import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';



import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { CompraModule } from './compra/compra.module';
import { SeedModule } from './seed/seed.module';
import { PaymentsModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FavoritoModule } from './favorito/favorito.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432, // default to 5432 if undefined
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),

    MateriaModule, GradoModule, PlanificacionModule, PlanificacionImagenModule, FilesModule, AuthModule, CompraModule, SeedModule, PaymentsModule, CartModule, DashboardModule, FavoritoModule,],
  controllers: [],
  providers: [],
})
export class AppModule { }
