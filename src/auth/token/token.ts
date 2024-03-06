import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { Payload } from '.';

@Injectable()
export class Token {
    constructor(private readonly jwtService: JwtService) {}
    public async accessToken(
        payload: Omit<Payload, 'type'>,
    ): Promise<{ token: string; expireAt: number }> {
        try {
            const timestampInSec = new Date().getTime() / 1000;
            const expireAt = Math.floor(timestampInSec + 60 * 60);

            const token = this.jwtService.sign(
                { ...payload, type: 'ACCESS_TOKEN' },
                { privateKey: jwtConstants.private },
            );

            return { token, expireAt };
        } catch (error) {
            throw new Error('Failed to generate access token.');
        }
    }

    public async refreshToken(
        id: string,
    ): Promise<{ token: string; expireAt: number }> {
        try {
            const timestampInSec = new Date().getTime() / 1000;
            const expireAt = Math.floor(timestampInSec + 60 * 60);

            const token = this.jwtService.sign(
                { id, type: 'REFRESH_TOKEN' },
                { privateKey: jwtConstants.private },
            );

            return { token, expireAt };
        } catch (error) {
            throw new Error('Failed to generate refresh token.');
        }
    }
}
