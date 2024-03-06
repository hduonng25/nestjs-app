import {
    Global,
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas';
import { UserController } from './user.controller';
import { RolesMiddleware } from './middleware/roles.middleware';
import { checkUser } from './middleware/check';
import { LoggerModule } from 'src/logger';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        LoggerModule,
    ],
    providers: [
        {
            provide: 'USER_SERVICE',
            useClass: UserService,
        },
        {
            provide: 'CHECK_USER',
            useClass: checkUser,
        },
    ],
    controllers: [UserController],
    exports: [
        {
            provide: 'USER_SERVICE',
            useClass: UserService,
        },
    ],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RolesMiddleware)
            .forRoutes(
                { path: '/user/', method: RequestMethod.POST },
                { path: '/user/update', method: RequestMethod.PUT },
            );
    }
}
