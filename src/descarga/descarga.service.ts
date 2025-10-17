import { Injectable } from '@nestjs/common';
import { CreateDescargaDto } from './dto/create-descarga.dto';
import { UpdateDescargaDto } from './dto/update-descarga.dto';

@Injectable()
export class DescargaService {
  create(createDescargaDto: CreateDescargaDto) {
    return 'This action adds a new descarga';
  }

  findAll() {
    return `This action returns all descarga`;
  }

  findOne(id: number) {
    return `This action returns a #${id} descarga`;
  }

  update(id: number, updateDescargaDto: UpdateDescargaDto) {
    return `This action updates a #${id} descarga`;
  }

  remove(id: number) {
    return `This action removes a #${id} descarga`;
  }
}
