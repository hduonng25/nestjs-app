import { IsNotEmpty, Min } from '@nestjs/class-validator';

export class FindReqQuery {
    type?: string;

    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    @Min(0)
    size: number;

    query?: string;

    sort?: string;
}
