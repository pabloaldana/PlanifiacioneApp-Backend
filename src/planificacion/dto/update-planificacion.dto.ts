import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanificacionDto } from './create-planificacion.dto';
import { IsOptional, IsString } from 'class-validator';


export class UpdatePlanificacionDto extends PartialType(CreatePlanificacionDto) {}
