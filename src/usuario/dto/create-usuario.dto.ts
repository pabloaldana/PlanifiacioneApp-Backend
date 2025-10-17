import { IsEmail, isEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    lastname:string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email:string
}
