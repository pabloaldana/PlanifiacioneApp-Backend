import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanificacionDto } from './dto/create-planificacion.dto';
import { UpdatePlanificacionDto } from './dto/update-planificacion.dto';
import { FilesService } from 'src/files/files.service';
import { CompraService } from 'src/compra/compra.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Planificacion } from './entities/planificacion.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { ValidRoles } from 'src/auth/interfaces';

@Injectable()
export class PlanificacionService {

  constructor(
    @InjectRepository(Planificacion)
    private readonly planifiacionRepository: Repository<Planificacion>,
    private readonly fileService: FilesService,
    private readonly compraService: CompraService,
  ) { }


  async create(createPlanificacionDto: CreatePlanificacionDto, url: string, public_id: string, userId) {

    const exists = await this.planifiacionRepository.findOne({
      where: { title: createPlanificacionDto.title }
    });

    if (exists) throw new BadRequestException('Ya existe una planificación con ese título');

    const newPlanificacion = this.planifiacionRepository.create({
      title: createPlanificacionDto.title,
      description: createPlanificacionDto.description,
      price: createPlanificacionDto.price,
      url,
      public_id,
      materia: { id: createPlanificacionDto.materiaId },   // RELACIÓN
      grado: { id: createPlanificacionDto.gradoId },       // RELACIÓN
      user: { id: userId } //las relaciones se hacen asi
    });

    await this.planifiacionRepository.save(newPlanificacion)
    return newPlanificacion;
  }

  async findAll() {
    return await this.planifiacionRepository
      .createQueryBuilder('planificacion')
      .select([
        'planificacion.id',
        'planificacion.title',
        'planificacion.description',
        'planificacion.price',
        'planificacion.is_active',
        'planificacion.created_at',
        'planificacion.updated_at',
      ])
      .leftJoinAndSelect('planificacion.materia', 'materia')
      .leftJoinAndSelect('planificacion.grado', 'grado')
      .getMany();
  }

  async count(): Promise<number> {
    return this.planifiacionRepository.count();
  }

  async countByUser(userId: string): Promise<number> {
    return this.planifiacionRepository.count({ where: { user: { id: userId } } });
  }

  async findOne(id: number) {
    const planificacion = await this.planifiacionRepository
      .createQueryBuilder('planificacion')
      .select([
        'planificacion.id',
        'planificacion.title',
        'planificacion.description',
        'planificacion.price',
        'planificacion.is_active',
        'planificacion.created_at',
        'planificacion.updated_at',
      ])
      .leftJoinAndSelect('planificacion.materia', 'materia')
      .leftJoinAndSelect('planificacion.grado', 'grado')
      .where('planificacion.id = :id', { id })
      .getOne();
    if (!planificacion) throw new NotFoundException(`Planificacion with id ${id} not found`);
    return planificacion;
  }

  private async findOneInternal(id: number) {
    const planificacion = await this.planifiacionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!planificacion) throw new NotFoundException(`Planificacion with id ${id} not found`);
    return planificacion;
  }

  private isOwnerOrSuperAdmin(planificacion: Planificacion, user: User): boolean {
    const isSuperAdmin = user.roles.includes(ValidRoles.superAdmin);
    const isOwner = planificacion.user.id === user.id;

    return isSuperAdmin || isOwner;
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

  async getDownloadUrl(id: number, user: User) {
    const planificacion = await this.findOneInternal(id);

    const hasPurchased = await this.compraService.hasPurchased(user.id, id);

    if (!this.isOwnerOrSuperAdmin(planificacion, user) && !hasPurchased) {
      throw new ForbiddenException('No has comprado esta planificacion');
    }

    const url = this.fileService.getSignedDownloadUrl(planificacion.public_id);
    return { url };
  }

  async assertCanManage(planificacionId: number, user: User): Promise<Planificacion> {
    const planificacion = await this.findOneInternal(planificacionId);

    if (!this.isOwnerOrSuperAdmin(planificacion, user)) {
      throw new ForbiddenException('No tenes permisos sobre esta planificacion');
    }

    return planificacion;
  }

  async remove(id: number) {
    const planificacion = await this.findOneInternal(id);

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
