import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { MateriaModule } from 'src/materia/materia.module';
import { GradoModule } from 'src/grado/grado.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [MateriaModule,GradoModule,AuthModule]
})
export class SeedModule {}
