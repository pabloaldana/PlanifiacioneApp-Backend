import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Req, ParseIntPipe } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { CreatePlanificacionDto } from './dto/create-planificacion.dto';
import { UpdatePlanificacionDto } from './dto/update-planificacion.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/files/helpers/fileFilter.helper';
import { FilesService } from '../files/files.service';

import { AuthService } from 'src/auth/auth.service';

import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/entities/auth.entity';

@Controller('planificaciones')
export class PlanificacionController {
  constructor(
    private readonly planificacionService: PlanificacionService,
    private readonly fileService: FilesService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) { }

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async create(
    @Body() createPlanificacionDto: CreatePlanificacionDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ) {
    if (!file) throw new BadRequestException('El archivo PDF es obligatorio')

    const { url, public_id } = await this.fileService.uploadFile(file)

    return this.planificacionService.create(createPlanificacionDto, url, public_id, user.id);
  }

  @Get()
  findAll() {
    return this.planificacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planificacionService.findOne(id);
  }


  @Patch(':id')
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanificacionDto: UpdatePlanificacionDto,
    @UploadedFile() file: Express.Multer.File,) {
    if (file) {
      const { url, public_id } = await this.fileService.uploadFile(file)
      return this.planificacionService.update(id, updatePlanificacionDto, url, public_id);
    }
    return this.planificacionService.update(id, updatePlanificacionDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planificacionService.remove(id);
  }

  @Get(':id/download')
  @Auth()
  getDownloadUrl(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.planificacionService.getDownloadUrl(id, user);
  }

}