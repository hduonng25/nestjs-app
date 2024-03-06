import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MyLogger } from './logger';
import {
    HttpErrorExceptionFilter,
    NotFoundExceptionFilter,
} from './shared/filter';

async function main() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        {
            logger: ['debug', 'error', 'fatal', 'verbose', 'warn'],
        },
    );
    app.useGlobalPipes(new ValidationPipe());

    const config = app.get(ConfigService);
    const logger = app.get(MyLogger);

    const prefix = config.get('app.prefix');
    const host = config.get('app.host');
    const port = config.get('app.port');

    app.setGlobalPrefix(prefix);
    app.useGlobalFilters(new NotFoundExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    app.useBodyParser('json', { limit: '10mb' });

    await app.listen(port, host, () => {
        logger.log(`Listening on: ${host}:${port}`);
    });
}
main();
