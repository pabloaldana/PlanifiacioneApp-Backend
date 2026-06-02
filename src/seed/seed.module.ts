import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MateriaModule } from 'src/materia/materia.module';
import { GradoModule } from 'src/grado/grado.module';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/auth.entity';
import { Planificacion } from 'src/planificacion/entities/planificacion.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    MateriaModule,
    GradoModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Planificacion]),
  ]
})
export class SeedModule {}
