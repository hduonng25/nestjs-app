import { IsNotEmpty } from 'class-validator';

export class UserBody {
    id?: string;

    @IsNotEmpty()
    email?: string;

    @IsNotEmpty()
    name?: string;
}

export class CreateUserBody extends UserBody {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    roles: string[];
}

export class UpdateUserBody extends UserBody {
    @IsNotEmpty()
    roles: string[];
}
