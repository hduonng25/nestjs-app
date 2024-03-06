import {
    ArgumentsHost,
    CallHandler,
    Catch,
    ExceptionFilter,
    NotFoundException,
} from '@nestjs/common';
import { HttpsStatus } from 'src/constant';
import { ResultError } from '../result';
import { NextFunction } from 'express-serve-static-core';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(_exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let error: ResultError = {
            status: HttpsStatus.NOT_FOUND,
            code: 'NOT_FOUND',
            description: {
                vi: 'Khong tim thay duong dan duoc yeu cau',
                en: 'url not found',
            },
        };

        response.json(error);
    }
}
