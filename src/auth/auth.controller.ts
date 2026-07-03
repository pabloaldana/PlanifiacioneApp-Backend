import { Controller, Post, Body, Get, Patch, Param, Query, DefaultValuePipe, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
  UpdateProfileDto,
  UpdateUserStatusDto,
  UpdateUserRolesDto,
  GoogleLoginDto,
} from './dto/index';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import { User } from './entities/auth.entity';
import { FilesService } from 'src/files/files.service';
import { imageFileFilter } from 'src/files/helpers/fileFilter.helper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly filesService: FilesService,
  ) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('google')
  googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.googleLogin(googleLoginDto.credential);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }

  @Post('logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
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

  @Post('me/avatar')
  @Auth()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadAvatar(@GetUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('La imagen es obligatoria');

    const { url, public_id } = await this.filesService.uploadImage(file);
    return this.authService.updateAvatar(user, url, public_id);
  }

  @Get('users')
  @Auth(ValidRoles.superAdmin)
  findAllUsers() {
    return this.authService.findAllUsers();
  }

  @Get('users/recent')
  @Auth(ValidRoles.superAdmin)
  findRecentUsers(@Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number) {
    return this.authService.findRecentUsers(limit);
  }

  @Patch('users/:id/status')
  @Auth(ValidRoles.superAdmin)
  updateUserStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.authService.updateUserStatus(id, dto.isActive);
  }

  @Patch('users/:id/roles')
  @Auth(ValidRoles.superAdmin)
  updateUserRoles(@Param('id') id: string, @Body() dto: UpdateUserRolesDto) {
    return this.authService.updateUserRoles(id, dto.roles);
  }

  @Get('private')
  @Auth(ValidRoles.superAdmin)
  privateRoute3(@GetUser() user: User) {
    return { ok: true, user };
  }
}
