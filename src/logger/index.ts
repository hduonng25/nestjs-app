import { HttpsStatus } from 'src/constant';
import { logger } from './configs';

export * from './logger.module';
export * from './logger.service';

export const logResponse = (
    request_id: string,
    status_code: HttpsStatus,
    body: any,
    correlation_id?: string,
): void => {
    const response_time = new Date();
    const data = {
        request_id,
        correlation_id,
        response_time,
        status_code,
        body,
    };
    logger.info(JSON.stringify(data), {
        tags: ['response'],
    });
};
