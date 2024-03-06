import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
} from '@nestjs/common';
import { configs } from 'src/config';
import errorList, { ErrorData, HttpError } from 'src/shared/error';
import { ResultError } from 'src/shared/result';
import { mask } from '../mask';
import { logResponse } from 'src/logger';

@Catch(HttpError)
export class HttpErrorExceptionFilter implements ExceptionFilter {
    catch(exception: HttpError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();

        const environment = configs().environment || 'pro';
        let responseData: any;
        let resultError = exception.getResponse() as ResultError;
        let { lang } = request.headers;
        lang = lang ?? 'vi';
        const errorCode = resultError.code ?? 'UNKNOWN_ERROR';
        const err = errorList.find(
            (value: ErrorData) => value.errorCode === errorCode,
        );
        let description: string | undefined = undefined;
        if (resultError.description?.vi && lang === 'vi') {
            description = resultError.description.vi;
        }
        if (resultError.description?.en && lang === 'en') {
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

        const maskedResponseData = { ...responseData }; //Muon an access_token va refresh_token thi chon responeData

        mask(maskedResponseData, [
            'password',
            'access_token',
            'refresh_token',
        ]);
        const correlationId = request.correlation_id;
        const request_id = request.request_id;
        const requestBody = JSON.parse(JSON.stringify(request.body));
        
        mask(requestBody, [
            'password',
            'access_token',
            'refresh_token',
        ]);

        logResponse(
            request_id,
            status,
            maskedResponseData,
            correlationId,
        );
        response.status(status).json(responseData);
    }
}
