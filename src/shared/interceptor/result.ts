import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { HttpsStatus } from '../../constant';
import {
    Result,
    ResultError,
    ResultSuccess,
    error,
} from 'src/shared/result';
import { configs } from 'src/config';
import errorList, { ErrorData } from 'src/shared/error';
import { mask } from '../mask';
import { logger } from 'src/logger/configs';
import { logResponse } from 'src/logger';

//TODO: Chuyen sang dang Json truoc khi tra ve phia client o moi dau api
@Injectable()
export class ResultInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<void> {
        return next.handle().pipe(
            map((data: Result) => {
                const response = context
                    .switchToHttp()
                    .getResponse();
                const request = context.switchToHttp().getRequest();
                const statusCode =
                    data.status ?? HttpsStatus.BAD_REQUEST;
                const environment = configs().environment || 'pro';
                let responseData: any;

                if (data.status > 300) {
                    let resultError = data as ResultError;
                    if (
                        environment === 'pro' &&
                        resultError.status ===
                            HttpsStatus.METHOD_NOT_ALLOWED
                    ) {
                        resultError = error.urlNotFound(
                            request.path,
                        );
                    }
                    let { lang } = request.headers;
                    lang = lang ?? 'vi';
                    const errorCode =
                        resultError.code ?? 'UNKNOWN_ERROR';
                    const err = errorList.find(
                        (value: ErrorData) =>
                            value.errorCode === errorCode,
                    );
                    let description: string | undefined = undefined;
                    if (
                        resultError.description?.vi &&
                        lang === 'vi'
                    ) {
                        description = resultError.description.vi;
                    }
                    if (
                        resultError.description?.en &&
                        lang === 'en'
                    ) {
                        description = resultError.description.en;
                    }
                    if (!description && err && err.description) {
                        if (err.description.vi && lang === 'vi') {
                            description = err.description.vi;
                        }
                        if (err.description.en && lang === 'en') {
                            description = err.description.en;
                        }
                    }
                    responseData = {
                        code: errorCode,
                        description: description,
                        details: resultError.details,
                    };

                    if (environment === 'dev') {
                        responseData['errors'] = resultError.errors;
                    }
                } else {
                    const resultSuccess = data as ResultSuccess;
                    responseData =
                        resultSuccess.data ?? resultSuccess;
                }
                if (
                    responseData !== null &&
                    responseData !== undefined
                ) {
                    if (typeof responseData.toJSON === 'function') {
                        responseData = responseData.toJSON();
                    }
                }

                const maskedResponseData = {
                    responseData,
                };

                mask(maskedResponseData, [
                    'password',
                    'access_token',
                    'refresh_token',
                ]);
                const correlationId = request.correlation_id;
                const request_id = request.request_id;
                const requestBody = JSON.parse(
                    JSON.stringify(request.body),
                );
                mask(requestBody, [
                    'password',
                    'access_token',
                    'refresh_token',
                ]);

                logResponse(
                    request_id,
                    statusCode,
                    maskedResponseData,
                    correlationId,
                );
                response.status(statusCode).json(responseData);
            }),
        );
    }
}
