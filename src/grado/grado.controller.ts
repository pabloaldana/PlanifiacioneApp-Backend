import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GradoService } from './grado.service';
import { CreateGradoDto } from './dto/create-grado.dto';
import { UpdateGradoDto } from './dto/update-grado.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('grados')
export class GradoController {
  constructor(private readonly gradoService: GradoService) { }

  @Post()
  @Auth(ValidRoles.superAdmin)
  create(@Body() createGradoDto: CreateGradoDto) {
    return this.gradoService.create(createGradoDto);
  }

  @Get()
  findAll() {
    return this.gradoService.findAll();
  }

  @Get('cycles')
  findForCycle() {
    return this.gradoService.findForCycle();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gradoService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superAdmin)
  update(@Param('id') id: string, @Body() updateGradoDto: UpdateGradoDto) {
    return this.gradoService.update(+id, updateGradoDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superAdmin)
  remove(@Param('id') id: string) {
    return this.gradoService.remove(+id);
  }
}
