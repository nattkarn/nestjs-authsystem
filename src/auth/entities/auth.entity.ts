export class Auth {

    
    id: number;
    username: string;
    email: string;
    password: string;
    provider?: string;
    name?: string;
    tel?: string;
    Token?: string;
    resetPasswordToken?: string;
    confirmationToken?: string;
    confirmed?: boolean;
    blocked?: boolean;
    roleId: number;
}
