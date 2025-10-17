import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import {validate as isUUID} from 'uuid'
import { Comentario } from 'src/comentario/entities/comentario.entity';
import { ComentarioController } from 'src/comentario/comentario.controller';

@Injectable()
export class UsuarioService {

  private readonly logger = new Logger('UsuarioService');

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,

    @InjectRepository(Comentario)
    private comentarioRepository : Repository<Comentario>
  ){}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const defaultRole = await this.rolRepository.findOneBy({ name: 'usuario' });
    if (!defaultRole) {
     throw new NotFoundException('El rol por defecto "usuario" no fue encontrado');
    }
    try {
      const usuario = this.usuarioRepository.create({
        ...createUsuarioDto,
        rol: defaultRole,
      });
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const usuarios =  await this.usuarioRepository.find({where:{is_active:true}});
    const resp = usuarios.map(usuario=>({
      ...usuario, rol: usuario.rol.name
    }))
    return resp;
  }

  async findOne(id: string) {

    if (!isUUID(id)) throw new BadRequestException(`El id ${id} no es un UUID válido`);

    const usuario  = await this.usuarioRepository.findOneBy({id})
    if(!usuario) throw new NotFoundException(`Usuario with id ${id} not found`);

    const resp = {...usuario, rol: usuario.rol.name}
    return resp;
  }
  //! ACA SE ACTULIZAN COLUMNAS DEL USAURIOS
async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
  const usuario = await this.usuarioRepository.findOne({ where: { id } });
  if (!usuario) throw new NotFoundException(`Usuario no encontrado`);

  Object.assign(usuario, updateUsuarioDto); // actualiza solo campos normales
  return await this.usuarioRepository.save(usuario);
}

  //! actualiza el campo is_active para activar o desactivar un usuario SERIA COMO UN BORRADO LOGICO
  async updateStatus(id: string, is_active: boolean) {
  if (!isUUID(id))
    throw new BadRequestException(`El id ${id} no es un UUID válido`);

  const usuario = await this.usuarioRepository.findOne({
    where: { id },
    relations: ['comentarios'], // CORRECCIÓN
  });

  if (!usuario)
    throw new NotFoundException(`Usuario con id ${id} no encontrado`);

  // Actualizar usuario
  usuario.is_active = is_active;
  await this.usuarioRepository.save(usuario);

  // Actualizar comentarios del usuario
  if (usuario.comentarios?.length) {
    usuario.comentarios.forEach(c => c.is_active = is_active);
    await this.comentarioRepository.save(usuario.comentarios);
  }

  return usuario;
}

  private handleDBExceptions(error: any){
    if (error.code === '23505') {
        //!aca me muestra el error en postman
        throw new InternalServerErrorException('El producto ya existe');
      }
      //!aca me muestra el error en la consola
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs'); 
  }
}
