import { HttpsStatus } from 'src/constant';

export interface ResultSuccess {
    status: HttpsStatus;
    data: any;
}

export interface ResultError {
    status: HttpsStatus;
    code?: string;
    description?: {
        vi: string;
        en: string;
    };
    errors?: ErrorDetail[];
    details?: any;
}

export interface ErrorDetail {
    location?: string;
    method?: string;
    url?: string;
    value?: any;
    param?: string;
    message?: string;
}

export type Result = ResultSuccess | ResultError;
