import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas';
import { Token } from './token';
import { UserModule } from 'src/user';
import { LoggerModule } from 'src/logger';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                privateKey: config.get('keys.private_key'),
                signOptions: { expiresIn: '2h', algorithm: 'RS256' },
            }),
        }),
        LoggerModule,
        UserModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [AuthService, JwtStrategy, Token],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
