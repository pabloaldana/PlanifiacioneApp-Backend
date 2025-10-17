import { IsString, MinLength } from "class-validator";




export class CreateGradoDto {

    @IsString()
    @MinLength(1)
    name:string
}
