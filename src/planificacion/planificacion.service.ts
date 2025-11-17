import { Injectable } from '@nestjs/common';
import { CreatePlanificacionDto } from './dto/create-planificacion.dto';
import { UpdatePlanificacionDto } from './dto/update-planificacion.dto';
import { FilesService } from 'src/files/files.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Planificacion } from './entities/planificacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanificacionService {

  constructor(
    @InjectRepository(Planificacion)
    private readonly planifiacionRepository : Repository<Planificacion>,
    private readonly fileService : FilesService
  ){}


  async create(createPlanificacionDto: CreatePlanificacionDto,url:string,public_id:string,userId) {

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

  findAll() {
    return `This action returns all planificacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planificacion`;
  }

  update(id: number, updatePlanificacionDto: UpdatePlanificacionDto) {
    return `This action updates a #${id} planificacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} planificacion`;
  }
}
