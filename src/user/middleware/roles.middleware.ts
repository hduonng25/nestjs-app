import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HttpsStatus } from 'src/constant';
import { MyLogger } from 'src/logger';
import { HttpError } from 'src/shared/error';

enum Roles {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

@Injectable()
export class RolesMiddleware implements NestMiddleware {
    constructor(private readonly logger: MyLogger) {}
    
    use(req: Request, _: Response, next: NextFunction) {
        const roles = [Roles.ADMIN, Roles.USER];
        if (req.body.roles) {
            const invalidRoles = req.body.roles.filter(
                (role: any) => !roles.includes(role),
            );

            if (invalidRoles.length > 0) {
                throw new HttpError({
                    status: HttpsStatus.BAD_REQUEST,
                    code: 'INVALID_DATA',
                    description: {
                        en: `Invalid role: ${invalidRoles.join(',')}`,
                        vi: `Quyen khong hop le: ${invalidRoles.join(',')}`,
                    },
                    errors: [
                        {
                            location: `Roles`,
                            param: `${invalidRoles.join(',')}`,
                            value: `${invalidRoles.join(',')}`,
                        },
                    ],
                });
            } else {
                next();
            }
        } else {
            next();
        }
    }
}
