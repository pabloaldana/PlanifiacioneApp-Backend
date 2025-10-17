import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('cometario')
export class ComentarioController {
  constructor(private readonly cometarioService: ComentarioService) {}

  @Post()
  create(@Body() createCometarioDto: CreateComentarioDto) {
    return this.cometarioService.create(createCometarioDto);
  }

  @Get()
  findAll() {
    return this.cometarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cometarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCometarioDto: UpdateComentarioDto) {
    return this.cometarioService.update(+id, updateCometarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cometarioService.remove(+id);
  }
}
