import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';
import { Request } from 'express';
import { HttpError } from 'src/shared/error';
import { HttpsStatus } from 'src/constant';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        //Su dung role nhan vao ben phia controller roi check theo roles nguoi dung dang dang nhap
        const roles = this.reflector.get(Roles, context.getHandler());

        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest() as Request;
        const user = request.payload;
        const hasRequiredRole = roles.some((role: string) =>
            user.roles[0].includes(role),
        );

        if (!hasRequiredRole) {
            throw new HttpError({
                status: HttpsStatus.BAD_REQUEST,
                code: 'ROLES_BAD',
            });
        }

        return true;
    }
}
