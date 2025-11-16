import { BadGatewayException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto,LoginUserDto } from './dto/index';

import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';

import *as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
     private readonly userRepository: Repository<User>,

     
     private readonly  jwtService:JwtService
  ){}

  async create(createUserDto: CreateUserDto) {    
    try {
      //destructuro para no guardar la contraseña sin hashear
      const {password,...userData} = createUserDto;
      
      // const defaultRol = await this.rolRepository.findOneBy({ id: 3 });
      // if (!defaultRol) throw new Error("El rol con id 3 no existe");

      const newUser = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password,10),
        // rol: defaultRol
      });

      await  this.userRepository.save(newUser);

      //destructuro para no devolver la contraseña hasheada que no la quiero mostrar
      const {password:_,...userInfo} = newUser;

      return  {
        ...userInfo,
        token: this.jwtService.sign({id:newUser.id})
      }

    } catch (error) {
      this.handleDBErrors(error); 
    }
  }


  async login(loginUserDto:LoginUserDto){
    const {email,password} = loginUserDto;
    
    const user = await this.userRepository.findOne({
      where:{email},
      select:{email:true,password:true,id:true}
    })
   
    if (!user) throw new UnauthorizedException('Credentials are not valid (email)');

    if(!bcrypt.compareSync(password,user.password)) throw new UnauthorizedException('Credentials are not valid (password)');

    //!FALTA PREGUNTAR SI EL USUARIO ESTA ACTIVO O NO
    
    return {
      ...user,
      token: this.getJwtToken({id:user.id})
    }
  }
    private getJwtToken(payload:JwtPayload){
    const token = this.jwtService.sign( payload );
    return token;
  }


   private handleDBErrors(error:any):never{
    if(error.code === '23505'){
      throw new BadGatewayException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
