// src/users/dto/update-user.dto.ts
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class BandedUserDto {


  @IsEmail({}, { message: 'Email must be a required' })
  email: string;

  @IsBoolean({ message: 'Confirmation banded must be a boolean' })
  confirm: boolean;

}
