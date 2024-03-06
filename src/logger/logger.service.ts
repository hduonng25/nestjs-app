import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import logger from './configs/logger';

@Injectable()
export class MyLogger implements LoggerService {
    log(message: any, ...optionalParams: any[]) {
        logger.info(message, optionalParams);
    }

    error(message: any, ...optionalParams: any[]) {
        logger.error(message);
    }

    warn(message: any, ...optionalParams: any[]) {
        logger.warn(message);
    }

    debug?(message: any, ...optionalParams: any[]) {
        logger.debug(message);
    }

    verbose?(message: any, ...optionalParams: any[]) {
        logger.verbose(message);
    }

    fatal?(message: any, ...optionalParams: any[]) {
        logger.info(message);
    }

    setLogLevels?(levels: LogLevel[]) {
        logger.info(levels);
    }
}
