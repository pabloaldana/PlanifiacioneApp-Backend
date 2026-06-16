import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('me')
  @Auth()
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }

  @Patch('me')
  @Auth()
  updateProfile(@GetUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user, dto);
  }

  @Get('private')
  @Auth(ValidRoles.superAdmin)
  privateRoute3(@GetUser() user: User) {
    return { ok: true, user };
  }
}
