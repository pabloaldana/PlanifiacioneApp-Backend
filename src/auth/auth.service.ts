import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';

import *as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
     private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    
    try {
      //destructuro para no guardar la contraseña sin hashear
      const {password,...userData} = createUserDto;
      
      const newUser = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password,10),
      });

      await  this.userRepository.save(newUser);

      //destructuro para no devolver la contraseña hasheada que no la quiero mostrar
      const {password:_,...userInfo} = newUser;

      return  userInfo;

    } catch (error) {
      this.handleDBErrors(error); 
    }

  }

   private handleDBErrors(error:any):never{
    if(error.code === '23505'){
      throw new BadGatewayException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
