import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateGradoDto } from './dto/create-grado.dto';
import { UpdateGradoDto } from './dto/update-grado.dto';
import { Grado } from './entities/grado.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBException } from 'src/common/helpers/handle-db-error';

@Injectable()
export class GradoService {

  private readonly logger = new Logger('GradoService');
  //para poder usar gradoRepository y no tener que crear una instancia nueva en cada metodo
  constructor(
    @InjectRepository(Grado)
    private readonly gradoRepository: Repository<Grado>
  ) { }


  async create(createGradoDto: CreateGradoDto) {
    try {
      const grado = this.gradoRepository.create(createGradoDto);
      await this.gradoRepository.save(grado);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.gradoRepository
        .createQueryBuilder('grado')
        .select(['grado.id', 'grado.name', 'grado.numero'])
        .loadRelationCountAndMap(
          'grado.planificacionesCount',
          'grado.planificacion',
        )
        .orderBy('grado.numero', 'ASC')
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findForCycle() {
    const grados = await this.gradoRepository.find();

    return {
      primerCiclo: grados.filter(g => g.numero <= 3),
      segundoCiclo: grados.filter(g => g.numero >= 4 && g.numero <= 5),
      tercerCiclo: grados.filter(g => g.numero >= 6),
    };
  }


  async findOne(id: number) {
    const grado = await this.gradoRepository.findOneBy({ id })

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
    const grado = await this.findOne(id);
    try {
      await this.gradoRepository.remove(grado);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new BadRequestException('No podés eliminar este grado porque tiene planificaciones asociadas.');
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Error inesperado al eliminar el grado.');
    }
  }

  private handleDBExceptions(error: any) {
    handleDBException(error, this.logger, 'El grado ya existe');
  }

}
