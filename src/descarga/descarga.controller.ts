import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DescargaService } from './descarga.service';
import { CreateDescargaDto } from './dto/create-descarga.dto';
import { UpdateDescargaDto } from './dto/update-descarga.dto';

@Controller('descarga')
export class DescargaController {
  constructor(private readonly descargaService: DescargaService) {}

  @Post()
  create(@Body() createDescargaDto: CreateDescargaDto) {
    return this.descargaService.create(createDescargaDto);
  }

  @Get()
  findAll() {
    return this.descargaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.descargaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDescargaDto: UpdateDescargaDto) {
    return this.descargaService.update(+id, updateDescargaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.descargaService.remove(+id);
  }
}
