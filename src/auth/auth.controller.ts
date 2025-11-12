import { Controller, Post, Body, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto,LoginUserDto } from './dto/index';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import { User } from './entities/auth.entity';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto:LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @Auth(ValidRoles.superUser) //si le saqco el valid rol es para cualquier rol
  privateRoute3( 
    @GetUser() user: User
  ){ 
    return {
      ok: true,
      user
    }

  }
}
