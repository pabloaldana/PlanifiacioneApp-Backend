import { Controller, Get, Post, Delete, Param, UseInterceptors, UploadedFile, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { PlanificacionImagenService } from './planificacion-imagen.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/files/helpers/fileFilter.helper';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/auth/entities/auth.entity';

@Controller('planificaciones')
export class PlanificacionImagenController {
  constructor(
    private readonly planificacionImagenService: PlanificacionImagenService,
    private readonly fileService: FilesService,
  ) { }

  @Post(':id/imagenes')
  @Auth()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: imageFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async addImagen(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    if (!file) throw new BadRequestException('La imagen es obligatoria')

    const { url, public_id } = await this.fileService.uploadImage(file)

    return this.planificacionImagenService.addImagen(id, user, url, public_id);
  }

  @Get(':id/imagenes')
  findImagenes(@Param('id', ParseIntPipe) id: number) {
    return this.planificacionImagenService.findImagenes(id);
  }

  @Delete(':id/imagenes/:imagenId')
  @Auth()
  removeImagen(
    @Param('id', ParseIntPipe) id: number,
    @Param('imagenId', ParseIntPipe) imagenId: number,
    @GetUser() user: User,
  ) {
    return this.planificacionImagenService.removeImagen(id, imagenId, user);
  }
}