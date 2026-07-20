import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Req, ParseIntPipe, Query } from '@nestjs/common';
import { PlanificacionService } from './planificacion.service';
import { CreatePlanificacionDto } from './dto/create-planificacion.dto';
import { UpdatePlanificacionDto } from './dto/update-planificacion.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/files/helpers/fileFilter.helper';
import { FilesService } from '../files/files.service';
import { User } from 'src/auth/entities/auth.entity';

@Controller('planificaciones')
export class PlanificacionController {
  constructor(
    private readonly planificacionService: PlanificacionService,
    private readonly fileService: FilesService,
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
    if (!file) throw new BadRequestException('El archivo es obligatorio')

    const { url, public_id } = await this.fileService.uploadFile(file)
    const file_format = file.originalname.split('.').pop() ?? 'pdf'

    return this.planificacionService.create(createPlanificacionDto, url, public_id, file_format, user.id);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 12,
    @Query('materiaIds') materiaIds?: string,
    @Query('gradoIds') gradoIds?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.planificacionService.findAll(search, +page, +limit, materiaIds, gradoIds, sortBy);
  }

  @Get('admin')
  @Auth(ValidRoles.admin, ValidRoles.superAdmin)
  findAllAdmin(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy?: string,
    @Query('materiaIds') materiaIds?: string,
    @Query('gradoIds') gradoIds?: string,
    @GetUser() user?: User,
  ) {
    const userId = user?.roles.includes(ValidRoles.superAdmin) ? undefined : user?.id
    return this.planificacionService.findAll(search, +page, +limit, materiaIds, gradoIds, sortBy, true, userId, false);
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
      const file_format = file.originalname.split('.').pop() ?? 'pdf'
      return this.planificacionService.update(id, updatePlanificacionDto, url, public_id, file_format);
    }
    return this.planificacionService.update(id, updatePlanificacionDto);
  }

  @Patch(':id/reactivar')
  @Auth(ValidRoles.admin)
  reactivate(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.planificacionService.reactivate(id, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.planificacionService.remove(id, user);
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