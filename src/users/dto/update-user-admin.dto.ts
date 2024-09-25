// src/users/dto/update-user.dto.ts
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserFromAdminDto {

  @IsOptional() // This makes the field optional during update
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Telephone number must be a string' })
  tel?: string;

  @IsOptional()
  @IsBoolean({ message: 'Confirmation banded must be a boolean' })
  confirm?: boolean;
  

  @IsOptional()
  @IsBoolean({ message: 'Confirmation blocked must be a boolean' })
  block?: boolean;
}
