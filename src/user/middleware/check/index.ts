import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { HttpsStatus } from 'src/constant';
import { HttpError } from 'src/shared/error';
import { User } from 'src/user/schemas';

@Injectable()
export class checkUser {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: Model<User>,
    ) {}

    public async checkExits(params: {
        id?: string;
        email?: string;
    }): Promise<void> {
        const match: FilterQuery<User> = {
            email: {
                $regex: `^${params.email}$`,
                $options: 'i',
            },
            is_deleted: false,
        };

        const user = await this.UserModel.findOne(match);
        if (user && user.id !== params.id) {
            throw new HttpError({
                status: HttpsStatus.BAD_REQUEST,
                code: 'INVALID_DATA',
                description: {
                    en: 'email is readly exits',
                    vi: 'email da ton tai',
                },
                errors: [
                    {
                        location: 'email',
                        param: 'body',
                        value: params.email,
                    },
                ],
            });
        }

        return;
    }
}
