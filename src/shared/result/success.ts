import { HttpsStatus } from 'src/constant';
import { ResultSuccess } from './result';

export const ok = (data: any): ResultSuccess => {
    return { status: HttpsStatus.OK, data: data };
};

export const created = (data: any): ResultSuccess => {
    return {
        status: HttpsStatus.CREATED,
        data: data,
    };
};

export const noContent = (): ResultSuccess => {
    return {
        status: HttpsStatus.NO_CONTENT,
        data: undefined,
    };
};
