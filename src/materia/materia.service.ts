import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { Materia } from './entities/materia.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MateriaService {

  private readonly logger = new Logger('MateriaService');

  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>
  ){}


  async create(createMateriaDto: CreateMateriaDto) {
    try {
      const materia = this.materiaRepository.create(createMateriaDto);
      await this.materiaRepository.save(materia);
      return materia;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const materias = await this.materiaRepository.find();
      return materias;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findOne(id: number) {
    const materia = await this.materiaRepository.findOneBy({id});
    if(!materia) throw new NotFoundException(`Materia with id ${id} not found`);
    return materia;
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto) {
    const materia = await this.materiaRepository.findOneBy({id});
    if(!materia) throw new NotFoundException(`Materia with id ${id} not found`);
    
    const updatedMateria = {...materia, ...updateMateriaDto};
    return await this.materiaRepository.save(updatedMateria);
  }

  async remove(id: number) {
    const materia = await this.materiaRepository.findOneBy({id});
    if(!materia) throw new NotFoundException(`Materia with id ${id} not found`);
    await this.materiaRepository.remove(materia);
    return {message: `Materia with id ${id} has been removed`};
  }

    private handleDBExceptions(error: any){
      if (error.code === '23505') {
      //!aca me muestra el error en postman
          throw new InternalServerErrorException('El producto ya existe');
        }
        //!aca me muestra el error en la consola
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
      
    }
}
