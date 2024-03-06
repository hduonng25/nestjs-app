import { Expose, Transform, plainToClass } from '@nestjs/class-transformer';
import { IsNotEmpty } from '@nestjs/class-validator';

export abstract class BaseDTO {
    @Expose()
    id?: string;

    @IsNotEmpty()
    @Expose()
    email?: string;

    @IsNotEmpty()
    @Expose()
    name?: string;

    first_name: string;

    last_name: string;

    @Expose()
    @Transform(({ obj }) => obj.first_name + ' ' + obj.last_name)
    full_name: string;

    static plainInToClass<T>(this: new (...args: any[]) => T, obj: T): T {
        return plainToClass(this, obj, {
            excludeExtraneousValues: true,
        });
    }

    //Su dung de xoa di nhung ham thua trong req gui ve de tranh lam crack db
}
