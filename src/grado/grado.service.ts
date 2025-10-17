import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateGradoDto } from './dto/create-grado.dto';
import { UpdateGradoDto } from './dto/update-grado.dto';
import { Grado } from './entities/grado.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';

@Injectable()
export class GradoService {

  private readonly logger = new Logger('GradoService');
  //para poder usar gradoRepository y no tener que crear una instancia nueva en cada metodo
  constructor(
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>
  ){}


  async create(createGradoDto: CreateGradoDto) {
    try {
      const grado = this.gradoRepository.create(createGradoDto);
      await this.gradoRepository.save(grado);
    } catch (error) {
       this.handleDBExceptions(error);  
    }   
  }

  async findAll() {
    const grados = await this.gradoRepository.find()
    return grados;
  }

   async findOne(id: number) {
    const grado = await this.gradoRepository.findOneBy({id})

    if (!grado) throw new NotFoundException(`Grado with id ${id} not found`);

    return grado;
  }

  async update(id: number, updateGradoDto: UpdateGradoDto) {

    const grado = await this.findOne(id);
    
    if (!grado) throw new NotFoundException(`Grado with id ${id} not found`);
    
    if (updateGradoDto.name !== undefined) {
      grado.name = updateGradoDto.name;
    }
    
    await this.gradoRepository.save(grado);
    return grado;
  }

  async remove(id: number) {
    const grado = await this.gradoRepository.findBy({id})

    if (grado.length===0) throw new NotFoundException(`Grado with id ${id} not found`)

    await this.gradoRepository.remove(grado)
    
  }

  private handleDBExceptions(error: any){
    if (error.code === '23505') {
        //!aca me muestra el error en postman
        throw new InternalServerErrorException('El grado ya existe');
      }
      //!aca me muestra el error en la consola
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs'); 
  }

}
