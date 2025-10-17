import { IsInt, IsString, Max, Min } from "class-validator";

export class CreateComentarioDto {

    @IsString()
    text: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

}
