






import { IsEmail } from 'class-validator';



export class CheckUserDto {


    // Ensure 'email' is a valid email address
    @IsEmail()
    email: string;

}
