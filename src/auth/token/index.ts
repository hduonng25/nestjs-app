export * from './token';

export interface Payload {
    id: string;
    roles: string[];
    name: string;
    type: string;
    email: string;
}
