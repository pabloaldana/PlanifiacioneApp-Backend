import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}



  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, //aplico una funcion para q sea un pdf o un doc
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
     return file.originalname
  }

}
