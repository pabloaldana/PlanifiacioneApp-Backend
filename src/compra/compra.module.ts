import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [CompraController],
  providers: [CompraService],
  imports:[
    TypeOrmModule.forFeature([Compra]),
    AuthModule,
    PassportModule
  ]
})
export class CompraModule {}
