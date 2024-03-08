import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configs } from './config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController, AuthModule, jwtConstants } from './auth';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController, UserModule } from './user';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResultInterceptor } from './shared/interceptor';
import { checkToken } from './auth/token/check.token';
import {
    HttpErrorExceptionFilter,
    NotFoundExceptionFilter,
} from './shared/filter';
import { RolesGuard } from './shared/guards';
import { LoggerModule } from './logger/logger.module';
import { StoreModule } from './store/store.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
            load: [configs],
        }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '10m' },
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configs: ConfigService) => ({
                uri: configs.get('mongoUri'),
            }),
        }),
        LoggerModule.config({
            service: 'nest-app'
        }),
        StoreModule.forRoot(),
        UserModule,
        AuthModule,
    ],
    controllers: [AuthController, UserController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResultInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: HttpErrorExceptionFilter,
        },
        {
            provide: APP_FILTER,
            useClass: NotFoundExceptionFilter,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [UserModule, AuthModule, LoggerModule],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(checkToken)
            .exclude(
                {
                    path: '/auth/login',
                    method: RequestMethod.POST,
                },
                {
                    path: '/user/',
                    method: RequestMethod.POST,
                },
            )
            .forRoutes('*');
    }
}
