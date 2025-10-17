import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';

import { Rol } from './entities/rol.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {

  private readonly logger = new Logger('RolService');
  
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ){}

  async create(createRolDto: CreateRolDto) {
    try {
      const rol = this.rolRepository.create(createRolDto);
      await this.rolRepository.save(rol);
      return rol;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const roles = await this.rolRepository.find();
      return roles; 
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) {
        this.logger.warn(`Rol with id ${id} not found`);
      throw new NotFoundException(`Rol with id ${id} not found`);
    }
    return rol;
  }
  update(id: number, updateRolDto: UpdateRolDto) {
    return `This action updates a #${id} rol`;
  }

  remove(id: number) {
    return `This action removes a #${id} grado`;
  }

  private handleDBExceptions(error: any){
      if (error.code === '23505') {
          //!aca me muestra el error en postman
          throw new InternalServerErrorException('El rol ya existe');
      }
        //!aca me muestra el error en la consola
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
      
    }
}
