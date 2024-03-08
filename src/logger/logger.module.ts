import { DynamicModule, Global, Module } from '@nestjs/common';
import { MyLogger } from './logger.service';
import { LoggerConfigurations } from './configs';
import logger from './configs/logger';
import { configLogger } from 'src/config';

@Module({})
export class LoggerModule {
    static config(config: LoggerConfigurations): DynamicModule {
        configLogger(config.service);
        return {
            module: LoggerModule,
            providers: [
                MyLogger,
                {
                    provide: 'LOGGER_CONFIG',
                    useValue: config,
                },
            ],
            exports: [MyLogger]
        };
    }
}
