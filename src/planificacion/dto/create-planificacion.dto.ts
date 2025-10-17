import { IsNumber, IsOptional, IsString, MinLength } from "class-validator"

export class CreatePlanificacionDto {

    @IsString()
    @MinLength(1)
    title:string

    @IsString()
    @IsOptional()
    description?: string

    @IsNumber()
    @IsOptional()
    price?:number
}
