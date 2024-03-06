import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class AuthBodyReq {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
