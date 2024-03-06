import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBodyReq } from './dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) {}

    @Post('login')
    async login(@Body() body: AuthBodyReq) {
        return this.AuthService.login({ ...body });
    }
}
