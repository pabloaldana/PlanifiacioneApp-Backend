import { IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreatePlanificacionDto {

    @IsString()
    @MinLength(1)
    title!: string

    @IsString()
    @IsOptional()
    description!: string

    @IsString()
    @IsOptional()
    content?: string

    @IsNumber()
    @IsOptional()
    price!: number

    @IsNumber()
    @IsPositive()
    materiaId!: number;

    @IsNumber()
    @IsPositive()
    gradoId!: number;

}
