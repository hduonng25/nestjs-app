export interface FindReqQuery {
    type?: string;

    page: number;

    size: number;

    query?: string;

    sort?: string;
}
