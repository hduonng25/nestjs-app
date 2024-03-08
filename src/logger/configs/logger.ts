import winston, { LoggerOptions } from 'winston';
import Transport from 'winston-transport';
import 'winston-daily-rotate-file';
import { LogstashTransport } from './transport';
import { configs } from 'src/config';
import { LoggerConfigurations } from '.';

function getTransports(): Transport[] {
    const fileEnabled = true;
    const logstashEnabled = false;
    const options = {
        file: {
            level: 'info',
            datePattern: 'YYYY-MM-DD-HH',
            filename: 'logs/application-%DATE%.log',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            colorize: true,
            json: false,
        },
    };

    const transports: Transport[] = [
        new winston.transports.Console(options.console),
    ];
    if (fileEnabled) {
        const transport = new winston.transports.DailyRotateFile(options.file);
        transports.push(transport);
    }
    if (logstashEnabled) {
        const logstashHost = '127.0.0.1';
        const logstashPort = '50001';
        const logstashProtocol = 'udp';

        if (!logstashHost) {
            throw new Error('');
        }
        if (!logstashPort && !Number.isInteger(logstashPort)) {
            throw new Error('');
        }
        if (
            !logstashProtocol &&
            logstashProtocol != 'udp' &&
            logstashProtocol != 'tcp'
        ) {
            throw new Error('');
        }
        const transport = new LogstashTransport({
            level: 'info',
            host: logstashHost,
            port: Number(logstashPort),
            protocol: logstashProtocol as 'udp' | 'tcp',
            handleExceptions: true,
            service: configs().service,
        });
        transports.push(transport);
    }
    return transports;
}

function getOptions(config?: LoggerConfigurations): LoggerOptions {
    return {
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS',
            }),
            winston.format.printf((info: winston.Logform.TransformableInfo) => {
                let tags = '';
                if (info.tags && Array.isArray(info.tags)) {
                    tags = info.tags.map((t) => `[${t}]`).join('');
                }
                return `${info.timestamp} [${info.level}][${config.service}]${tags}: ${info.message}`;
            }),
        ),
        transports: getTransports(),
        exitOnError: false,
    };
}

declare module 'winston' {
    interface Logger {
        config: typeof setConfiguration;
    }
}

function setConfiguration(
    this: winston.Logger,
    config: LoggerConfigurations,
): void {
    const options = getOptions(config);
    this.configure(options);
}

const logger = winston.createLogger(getOptions());
logger.config = setConfiguration;

export default logger;
