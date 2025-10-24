import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploaded = await this.filesService.uploadFile(file);
    //! en uploaded viene  el link de descarga que tengo que guardar en la tabla planificaciones  y el public_id
    // console.log(uploaded) 
    return uploaded; // devuelve { url, public_id } 

  }
}
