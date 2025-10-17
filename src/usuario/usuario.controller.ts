import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuarioController {

  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.usuarioService.findOne(id);
  }

  //!ESTE ES PARA ACTUALIZAR CAMPOS DE USUARIOS
 @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

//! ESTE ES PARA ACTUALIZAR EL ESTATUS BORRADO LOGICO
  @Patch(':id/status')
  updateStatus(
    @Param('id',ParseUUIDPipe) id: string,
    @Body('is_active') isActive: boolean,
  ){
    return this.usuarioService.updateStatus(id, isActive);
  }
}
