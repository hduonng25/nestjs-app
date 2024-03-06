import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { VerifyOptions } from 'jsonwebtoken';
import { HttpsStatus } from 'src/constant';
import { configs } from 'src/config';
import { HttpError } from 'src/shared/error';
import { ErrorDetail, error } from 'src/shared/result';
import { Payload } from '.';

@Injectable()
export class checkToken implements NestMiddleware {
    constructor(private readonly JwtService: JwtService) {}

    use(req: Request, _: Response, next: NextFunction) {
        const token: string | undefined = req.header('token');

        const errors: ErrorDetail[] = [
            {
                param: 'token',
                location: 'header',
            },
        ];
        if (!token) {
            throw new HttpError({
                status: HttpsStatus.UNAUTHORIZED,
                code: 'NO_TOKEN',
                errors: errors,
            });
        }

        try {
            const publicKey = configs().keys.public_key;
            let payload = <Payload>this.JwtService.verify(token, {
                publicKey: publicKey,
            });

            req.payload = payload;

            const { type }: any = payload;

            if (type !== 'ACCESS_TOKEN') {
                throw new HttpError({
                    status: HttpsStatus.UNAUTHORIZED,
                    code: 'INVALID_TOKEN',
                    errors: errors,
                });
            }
            return next();
        } catch (error) {
            const e: Error = error as Error;
            if (e.name && e.name === 'TokenExpiredError') {
                throw new HttpError({
                    status: HttpsStatus.UNAUTHORIZED,
                    code: 'TOKEN_EXPIRED',
                    errors: errors,
                });
            } else {
                throw new HttpError({
                    status: HttpsStatus.UNAUTHORIZED,
                    code: 'INVALID_TOKEN',
                    errors: errors,
                });
            }
        }
    }
}
