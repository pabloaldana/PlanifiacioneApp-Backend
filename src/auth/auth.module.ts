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


@Module({
  controllers: [AuthController],

  providers: [AuthService,JwtStrategy],
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

//! SOLAMENTE SE EXPORTA LA CLASE CUANDO QUIERO USAR SERVICIOS EN OTRA CLASE