import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto } from './dto/index';

import { Repository, MoreThan } from 'typeorm';
import { User } from './entities/auth.entity';
import { RefreshToken } from './entities/refresh-token.entity';

import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { MailService } from 'src/mail/mail.service';

const REFRESH_TOKEN_TTL_DAYS = 30;

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      //destructuro para no guardar la contraseña sin hashear
      const { password, ...userData } = createUserDto;

      const newUser = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(newUser);

      const refreshToken = await this.generateRefreshToken(newUser);

      return {
        ...this.sanitizeUser(newUser),
        token: this.getJwtToken({ id: newUser.id }),
        refreshToken,
      }

    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (!user) throw new UnauthorizedException('Credentials are not valid');

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials are not valid');

    const refreshToken = await this.generateRefreshToken(user);

    return {
      ...this.sanitizeUser(user),
      token: this.getJwtToken({ id: user.id }),
      refreshToken,
    }
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const tokenHash = this.hashToken(dto.refreshToken);

    const storedToken = await this.refreshTokenRepository.findOne({
      where: { tokenHash, revoked: false, expiresAt: MoreThan(new Date()) },
      relations: ['user'],
    });

    if (!storedToken) throw new UnauthorizedException('Refresh token inválido o expirado');

    // Rotación: invalido el viejo y genero uno nuevo
    storedToken.revoked = true;
    await this.refreshTokenRepository.save(storedToken);

    const newRefreshToken = await this.generateRefreshToken(storedToken.user);

    return {
      token: this.getJwtToken({ id: storedToken.user.id }),
      refreshToken: newRefreshToken,
    };
  }

  async logout(dto: RefreshTokenDto) {
    const tokenHash = this.hashToken(dto.refreshToken);
    await this.refreshTokenRepository.update({ tokenHash }, { revoked: true });
    return { ok: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    // No revelamos si el email existe o no — evita enumeración de usuarios
    if (!user) return { ok: true };

    const code = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordCode = code;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepository.save(user);

    await this.mailService.sendPasswordResetCode(user.email, code);

    return { ok: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (
      !user ||
      !user.resetPasswordCode ||
      user.resetPasswordCode !== dto.code ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new BadRequestException('Código inválido o expirado');
    }

    user.password = bcrypt.hashSync(dto.newPassword, 10);
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    // Por seguridad, invalido todas las sesiones activas tras un cambio de contraseña
    await this.refreshTokenRepository.update({ user: { id: user.id } }, { revoked: true });

    return { ok: true };
  }

  getProfile(user: User) {
    return this.sanitizeUser(user);
  }

  async updateProfile(user: User, data: { name?: string; lastname?: string }) {
    await this.userRepository.update({ id: user.id }, data);
    const updated = await this.userRepository.findOneBy({ id: user.id });
    return this.sanitizeUser(updated as User);
  }

  async findAllUsers() {
    const users = await this.userRepository.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  async findRecentUsers(limit: number) {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return users.map((user) => this.sanitizeUser(user));
  }

  async updateUserStatus(id: string, isActive: boolean) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.isActive = isActive;
    await this.userRepository.save(user);

    if (!isActive) {
      // Si se desactiva, se cierran todas sus sesiones activas
      await this.refreshTokenRepository.update({ user: { id } }, { revoked: true });
    }

    return this.sanitizeUser(user);
  }

  async updateUserRoles(id: string, roles: string[]) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.roles = roles;
    await this.userRepository.save(user);

    return this.sanitizeUser(user);
  }

  //metodo para no retornar datos sensibles del usuarios como las contraseñas o los códigos de reseteo de contraseña
  private sanitizeUser(user: User) {
    const { password, resetPasswordCode, resetPasswordExpires, ...safeUser } = user;
    return safeUser;
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const plainToken = crypto.randomBytes(40).toString('hex');

    const refreshToken = this.refreshTokenRepository.create({
      user,
      tokenHash: this.hashToken(plainToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    });
    await this.refreshTokenRepository.save(refreshToken);

    return plainToken;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadGatewayException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
