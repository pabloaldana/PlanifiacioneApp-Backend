import { Injectable } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './entities/comentario.entity';

@Injectable()
export class ComentarioService {

  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
  ){}


  async create(createCometarioDto: CreateComentarioDto) {
    console.log(createCometarioDto)
    const comentario = this.comentarioRepository.create(createCometarioDto)
    return 'This action adds a new cometario';
  }

  findAll() {
    return `This action returns all cometario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cometario`;
  }

  update(id: number, updateCometarioDto: UpdateComentarioDto) {
    return `This action updates a #${id} cometario`;
  }

  remove(id: number) {
    return `This action removes a #${id} cometario`;
  }
}
