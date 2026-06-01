import { IsInt, IsPositive } from 'class-validator';

export class AddCartItemDto {
    @IsInt()
    @IsPositive()
    planificacionId!: number;
}
