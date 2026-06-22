import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanificacionDto } from './dto/create-planificacion.dto';
import { UpdatePlanificacionDto } from './dto/update-planificacion.dto';
import { FilesService } from 'src/files/files.service';
import { CompraService } from 'src/compra/compra.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Planificacion } from './entities/planificacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanificacionService {

  constructor(
    @InjectRepository(Planificacion)
    private readonly planifiacionRepository: Repository<Planificacion>,
    private readonly fileService: FilesService,
    private readonly compraService: CompraService,
  ) { }


  async create(createPlanificacionDto: CreatePlanificacionDto, url: string, public_id: string, userId) {

    const newPlanificacion = this.planifiacionRepository.create({
      title: createPlanificacionDto.title,
      description: createPlanificacionDto.description,
      price: createPlanificacionDto.price,
      url,
      public_id,
      materia: { id: createPlanificacionDto.materiaId },   // RELACIÓN
      grado: { id: createPlanificacionDto.gradoId },       // RELACIÓN
      user: { id: userId } //las relaciones se hacen asi
      //!COMO ERROR LO ESTABA HACIENDO id_user_creador EL NOMBRE QUE LE PUSE EN LA RELACION PERO ESTA MAL ES COMO ESTA ARRIBA
      // creador
    });

    await this.planifiacionRepository.save(newPlanificacion)
    return newPlanificacion;
  }

  async findAll() {
    const planificaciones = await this.planifiacionRepository.find()

    return planificaciones;
  }

  async findOne(id: number) {
    const planificacion = await this.planifiacionRepository.findOneBy({ id });
    if (!planificacion) throw new NotFoundException(`Planificacion with id ${id} not found`);
    return planificacion;
  }

  async update(id: number,
    updatePlanificacionDto: UpdatePlanificacionDto,
    url?: string,
    public_id?: string) {
    //controlar que el titulo no este ya en la tabla porque es unique

    const planificacion = await this.planifiacionRepository.findOne({
      where: { id },
      relations: ['user'] //esta linea me muestra el usuario que creo la planifiacion
    })

    if (!planificacion) throw new NotFoundException('Planificacion no encontrada')

    if (updatePlanificacionDto.title !== undefined) {
      const existsTitle = await this.planifiacionRepository.findOne({
        where: { title: updatePlanificacionDto.title }
      })

      // Validar si existe y NO es la misma planificacion
      if (existsTitle && existsTitle.id !== id) {
        throw new BadRequestException('Title is already in use');
      }
    }

    //todo: Actualizar solo los campos enviados, evita tener que hacer if, ya filta los campos con undefined
    const dataToUpdate = Object.fromEntries(
      Object.entries(updatePlanificacionDto).filter(([_, value]) => value !== undefined)
    );

    Object.assign(planificacion, dataToUpdate);
    if (url !== undefined) {
      planificacion.url = url
    }
    if (public_id !== undefined) {
      planificacion.public_id = public_id
    }
    await this.planifiacionRepository.save(planificacion)

    return planificacion;
  }

  async remove(id: number) {
    const planificacion = await this.findOne(id);

    const tieneCompras = await this.compraService.hasPurchases(id);

    if (tieneCompras) {
      planificacion.is_active = false;
      await this.planifiacionRepository.save(planificacion);
      return { message: 'Planificación con compras asociadas — se desactivó en lugar de eliminarse', is_active: false };
    }

    await this.planifiacionRepository.remove(planificacion);
    return { message: 'Planificación eliminada' };
  }
}
