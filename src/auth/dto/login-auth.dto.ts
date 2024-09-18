






import { IsString, IsEmail, IsBoolean, IsOptional, IsInt } from 'class-validator';



export class LoginAuthDto {


    // Ensure 'email' is a valid email address
    @IsEmail()
    email: string;

    // Ensure 'password' is a non-empty string
    @IsString()
    password: string;

}
