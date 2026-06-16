import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { GradoService } from 'src/grado/grado.service';
import { MateriaService } from 'src/materia/materia.service';
import { User } from 'src/auth/entities/auth.entity';
import { Planificacion } from 'src/planificacion/entities/planificacion.entity';
import { Compra, PaymentStatus } from 'src/compra/entities/compra.entity';
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
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
  ) {}

  async runSeed() {
    await this.loadSeed();
    return { message: 'Seed executed' };
  }

  private async loadSeed() {
    const { MATERIAS_SEED, GRADOS_SEED, USERS_SEED, PLANIFICACIONES_SEED, COMPRAS_SEED } = inicialData;

    // 1. Insertar materias, grados y usuarios en paralelo
    const insertPromises: Promise<any>[] = [];
    MATERIAS_SEED.forEach(materia => insertPromises.push(this.materiaService.create(materia)));
    GRADOS_SEED.forEach(grado => insertPromises.push(this.gradoService.create(grado)));
    USERS_SEED.forEach(user => insertPromises.push(this.userService.create(user)));
    await Promise.all(insertPromises);

    // 2. Buscar las entidades ya insertadas para obtener sus IDs
    const [materias, grados, users] = await Promise.all([
      this.materiaService.findAll(),
      this.gradoService.findAll(),
      this.userRepository.find(),
    ]);

    const adminUser = users.find(u => u.email === 'admin@example.com');
    if (!adminUser) return true;

    // 3. Crear planificaciones mapeando materia y grado por nombre/numero
    const planificaciones = await Promise.all(
      PLANIFICACIONES_SEED.map(plan => {
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
      }),
    );

    // 4. Crear compras mapeando comprador (por email) y planificacion (por titulo)
    const compraPromises = COMPRAS_SEED.map(compra => {
      const buyer = users.find(u => u.email === compra.userEmail);
      const planIndex = PLANIFICACIONES_SEED.findIndex(p => p.title === compra.planificacionTitle);
      const planificacion = planIndex >= 0 ? planificaciones[planIndex] : null;
      if (!buyer || !planificacion) return Promise.resolve(null);

      const nuevaCompra = this.compraRepository.create({
        user: { id: buyer.id },
        planificacion: { id: planificacion.id },
        priceAtPurchase: compra.priceAtPurchase,
        paymentStatus: compra.paymentStatus as PaymentStatus,
        paymentMethod: compra.paymentMethod,
        transactionId: compra.transactionId,
      });
      return this.compraRepository.save(nuevaCompra);
    });

    await Promise.all(compraPromises);
    return true;
  }
}
