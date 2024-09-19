// src/users/dto/update-user.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {

  @IsOptional() // This makes the field optional during update
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Telephone number must be a string' })
  tel?: string;
}
