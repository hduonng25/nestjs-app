import { Expose } from '@nestjs/class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserBody {
    id?: string;

    @IsNotEmpty()
    @Expose()
    email?: string;

    @IsNotEmpty()
    @Expose()
    name?: string;
}

export class CreateUserBody extends UserBody {
    @IsNotEmpty()
    @Expose()
    password: string;

    @IsNotEmpty()
    @Expose()
    roles: string[];
}

export class UpdateUserBody extends UserBody {
    @IsNotEmpty()
    @Expose()
    roles: string[];
}
