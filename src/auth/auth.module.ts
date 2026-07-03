import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.stratigie';
import { MailModule } from 'src/mail/mail.module';
import { FilesService } from 'src/files/files.service';
import { CloudinaryProvider } from 'src/files/helpers/cloudinary.provider';


@Module({
  controllers: [AuthController],

  // FilesService/CloudinaryProvider se proveen acá directo (no se importa FilesModule)
  // porque FilesModule ya importa AuthModule (para su guard) — importarlo de vuelta
  // acá crearía una dependencia circular entre los dos módulos.
  providers: [AuthService,JwtStrategy, FilesService, CloudinaryProvider],
    imports:[
    ConfigModule,

    TypeOrmModule.forFeature([User, RefreshToken]),

    PassportModule.register({defaultStrategy:'jwt'}),

    MailModule,

    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>{
        return {
          secret:configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn: '15m'
          }
        }
      }
    })
  ],
  exports:[AuthService,PassportModule,JwtModule,TypeOrmModule]
})
export class AuthModule {}