import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { GradoService } from 'src/grado/grado.service';
import { MateriaService } from 'src/materia/materia.service';
import { User } from 'src/auth/entities/auth.entity';
import { Planificacion } from 'src/planificacion/entities/planificacion.entity';
import { inicialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly materiaService: MateriaService,
    private readonly gradoService: GradoService,
    private readonly userService: AuthService,
    @InjectRepository(Planificacion)
    private readonly planificacionRepository: Repository<Planificacion>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.loadSeed();
    return { message: 'Seed executed' };
  }

  private async loadSeed() {
    const { MATERIAS_SEED, GRADOS_SEED, USERS_SEED, PLANIFICACIONES_SEED } = inicialData;

    // 1. Insertar materias, grados y usuarios en paralelo
    const insertPromises: Promise<any>[] = [];
    MATERIAS_SEED.forEach(materia => insertPromises.push(this.materiaService.create(materia)));
    GRADOS_SEED.forEach(grado => insertPromises.push(this.gradoService.create(grado)));
    USERS_SEED.forEach(user => insertPromises.push(this.userService.create(user)));
    await Promise.all(insertPromises);

    // 2. Buscar las entidades ya insertadas para obtener sus IDs
    const [materias, grados] = await Promise.all([
      this.materiaService.findAll(),
      this.gradoService.findAll(),
    ]);

    const adminUser = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) return true;

    // 3. Crear planificaciones mapeando materia y grado por nombre/numero
    const planificacionPromises = PLANIFICACIONES_SEED.map(plan => {
      const materia = materias.find(m => m.name === plan.materiaName);
      const grado = grados.find(g => g.numero === plan.gradoNumero);
      if (!materia || !grado) return Promise.resolve(null);

      const nuevaPlan = this.planificacionRepository.create({
        title: plan.title,
        description: plan.description,
        price: plan.price,
        url: plan.url,
        public_id: plan.public_id,
        materia: { id: materia.id },
        grado: { id: grado.id },
        user: { id: adminUser.id },
      });
      return this.planificacionRepository.save(nuevaPlan);
    });

    await Promise.all(planificacionPromises);
    return true;
  }
}
