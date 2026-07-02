import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './entities/favorito.entity';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class FavoritoService {

    constructor(
        @InjectRepository(Favorito)
        private readonly favoritoRepository: Repository<Favorito>,
    ) {}

    async add(planificacionId: number, user: User): Promise<Favorito> {
        const existing = await this.favoritoRepository.findOne({
            where: { user: { id: user.id }, planificacion: { id: planificacionId } },
        });

        if (existing) throw new ConflictException('Esta planificación ya está en tus favoritos');

        const favorito = this.favoritoRepository.create({
            user: { id: user.id },
            planificacion: { id: planificacionId },
        });

        return this.favoritoRepository.save(favorito);
    }

    async remove(planificacionId: number, user: User): Promise<void> {
        const favorito = await this.favoritoRepository.findOne({
            where: { user: { id: user.id }, planificacion: { id: planificacionId } },
        });

        if (!favorito) throw new NotFoundException('Favorito no encontrado');

        await this.favoritoRepository.remove(favorito);
    }

    async findAllByUser(user: User) {
        return this.favoritoRepository
            .createQueryBuilder('favorito')
            .innerJoinAndSelect('favorito.planificacion', 'planificacion')
            .leftJoinAndSelect('planificacion.materia', 'materia')
            .leftJoinAndSelect('planificacion.grado', 'grado')
            .leftJoinAndSelect('planificacion.imagenes', 'imagenes')
            .where('favorito.user = :userId', { userId: user.id })
            .orderBy('favorito.createdAt', 'DESC')
            .addOrderBy('imagenes.orden', 'ASC')
            .getMany();
    }

    async isFavorito(planificacionId: number, user: User): Promise<boolean> {
        const favorito = await this.favoritoRepository.findOne({
            where: { user: { id: user.id }, planificacion: { id: planificacionId } },
        });
        return !!favorito;
    }
}
