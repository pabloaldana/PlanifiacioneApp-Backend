import { IsArray, IsEnum } from 'class-validator';
import { ValidRoles } from '../interfaces/valid-roles';

export class UpdateUserRolesDto {
  @IsArray()
  @IsEnum(ValidRoles, { each: true })
  roles!: ValidRoles[];
}
