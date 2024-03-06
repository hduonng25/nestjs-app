import { Expose } from '@nestjs/class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from 'src/common/base.dto';

export class CreateUserBody extends BaseDTO {
    @IsNotEmpty()
    @Expose()
    password: string;

    @IsNotEmpty()
    @Expose()
    roles: string[];
}

export class UpdateUserBody extends BaseDTO {
    @IsNotEmpty()
    @Expose()
    roles: string[];
}
