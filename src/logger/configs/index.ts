export {default as logger} from './logger'
export * from './transport'

export interface LoggerConfigurations {
    service: string;
    logFileEnabled?: string;
    folderLogsPath?: string;

    logstashEnabled?: string;
    logstashHost?: string;
    logstashPort?: string;
    logstashProtocol?: string;
}
