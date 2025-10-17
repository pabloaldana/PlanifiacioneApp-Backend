import { PartialType } from '@nestjs/mapped-types';
import { CreateDescargaDto } from './create-descarga.dto';

export class UpdateDescargaDto extends PartialType(CreateDescargaDto) {}
