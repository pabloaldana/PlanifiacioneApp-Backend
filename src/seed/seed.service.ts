import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GradoService } from 'src/grado/grado.service';
import { MateriaService } from 'src/materia/materia.service';
import { inicialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly materiaService:MateriaService,
    private readonly gradoService:GradoService,
    private readonly userService:AuthService
  ) {}

  async runSeed() {
    this.loadSeed()
    return { message: 'Seed executed' };
  }

  private async loadSeed(){

    const materias = inicialData.MATERIAS_SEED
    const grados = inicialData.GRADOS_SEED
    const users = inicialData.USERS_SEED
    
    const insertPromises: Promise<any>[] = [];
    materias.forEach(materia =>{
      insertPromises.push(this.materiaService.create(materia));
    })

    grados.forEach(grado=>{
      insertPromises.push(this.gradoService.create(grado))
    })

    users.forEach(user =>{
      insertPromises.push(this.userService.create(user))
    })

    await Promise.all(insertPromises);
    return true
  }
}
