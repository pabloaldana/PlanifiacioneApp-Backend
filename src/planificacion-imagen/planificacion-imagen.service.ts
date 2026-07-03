import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanificacionImagen } from './entities/planificacion-imagen.entity';
import { FilesService } from 'src/files/files.service';
import { PlanificacionService } from 'src/planificacion/planificacion.service';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class PlanificacionImagenService {

  constructor(
    @InjectRepository(PlanificacionImagen)
    private readonly planificacionImagenRepository: Repository<PlanificacionImagen>,
    private readonly fileService: FilesService,
    private readonly planificacionService: PlanificacionService,
  ) { }

  async addImagen(id: number, user: User, url: string, public_id: string) {
    await this.planificacionService.assertCanManage(id, user);

    const { max } = await this.planificacionImagenRepository
      .createQueryBuilder('imagen')
      .select('MAX(imagen.orden)', 'max')
      .where('imagen.planificacionId = :id', { id })
      .getRawOne();

    const orden = max === null ? 0 : Number(max) + 1;

    const nuevaImagen = this.planificacionImagenRepository.create({
      url,
      public_id,
      orden,
      planificacion: { id },
    });

    await this.planificacionImagenRepository.save(nuevaImagen);
    return nuevaImagen;
  }

  async findImagenes(id: number) {
    await this.planificacionService.findOne(id);

    return this.planificacionImagenRepository
      .createQueryBuilder('imagen')
      .where('imagen.planificacionId = :id', { id })
      .orderBy('imagen.orden', 'ASC')
      .getMany();
  }

  async removeImagen(id: number, imagenId: number, user: User) {
    await this.planificacionService.assertCanManage(id, user);

    const imagen = await this.planificacionImagenRepository
      .createQueryBuilder('imagen')
      .where('imagen.id = :imagenId', { imagenId })
      .andWhere('imagen.planificacionId = :id', { id })
      .getOne();

    if (!imagen) throw new NotFoundException(`Imagen with id ${imagenId} not found`);

    await this.fileService.deleteImage(imagen.public_id);
    await this.planificacionImagenRepository.remove(imagen);

    return { message: 'Imagen eliminada' };
  }
}