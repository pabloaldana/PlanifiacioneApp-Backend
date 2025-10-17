import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class CreateRolDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name:string

}
