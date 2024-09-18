






import { IsString, IsEmail, IsBoolean, IsOptional, IsInt, IsUUID } from 'class-validator';



export class CreateAuthDto {


    // Ensure 'username' is a non-empty string
    @IsString()
    username: string;

    // Ensure 'email' is a valid email address
    @IsEmail()
    email: string;

    // Ensure 'password' is a non-empty string
    @IsString()
    password: string;

    // 'provider' is optional but if present, ensure it's a string
    @IsOptional()
    @IsString()
    provider?: string;

    // 'name' is optional but if present, ensure it's a string
    @IsOptional()
    @IsString()
    name?: string;

    // 'tel' is optional but if present, ensure it's a string
    @IsOptional()
    @IsString()
    tel?: string;

    // 'Token' is optional but if present, ensure it's a string
    @IsOptional()
    @IsString()
    Token?: string;

    // 'resetPasswordToken' is optional but if present, ensure it's a string
    @IsOptional()
    @IsString()
    resetPasswordToken?: string;

    // 'confirmationToken' is optional but if present, ensure it's a string
    @IsOptional()
    @IsString()
    confirmationToken?: string;

    // Ensure 'confirmed' is a boolean value
    @IsBoolean()
    confirmed?: boolean;

    // Ensure 'blocked' is a boolean value
    @IsBoolean()
    blocked?: boolean;

    // Ensure 'roleId' is an integer and is unique
    @IsInt()
    roleId: number;
}
