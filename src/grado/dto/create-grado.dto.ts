import { IsInt, IsString, Max, Min, MinLength } from "class-validator";




export class CreateGradoDto {

    @IsString()
    @MinLength(1)
    name!: string

    @IsInt()
    @Min(1)
    @Max(7)
    numero!: number;
}
