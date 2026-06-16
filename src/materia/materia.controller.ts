import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('materias')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) { }

  @Post()
  @Auth(ValidRoles.superAdmin)
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  findAll() {
    return this.materiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materiaService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superAdmin)
  update(@Param('id') id: string, @Body() updateMateriaDto: UpdateMateriaDto) {
    return this.materiaService.update(+id, updateMateriaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superAdmin)
  remove(@Param('id') id: string) {
    return this.materiaService.remove(+id);
  }
}
