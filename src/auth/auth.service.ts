import { Injectable } from '@nestjs/common';
import { error, success } from 'src/shared/result';
import { AuthBodyReq } from './dto';
import { HttpsStatus } from 'src/constant';
import * as bcrypt from 'bcrypt';
import { Token } from './token';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: Model<User>,
        private readonly Token: Token,
    ) {}

    public async login(params: AuthBodyReq) {
        try {
            const numberOfTried = 5;
            const account = await this.UserModel.findOne({
                email: params.email,
                is_deleted: false,
            });

            if (account && account.password) {
                if (account.failed_login === numberOfTried - 1) {
                    account.last_locked = new Date();
                } else if (account.failed_login === numberOfTried) {
                    const lastLocked = account.last_locked
                        ? account.last_locked
                        : new Date();

                    const now = new Date();
                    const diffInMicrosecond =
                        now.getTime() - lastLocked.getTime();
                    const diffInMinutes = Math.ceil(
                        diffInMicrosecond / (60 * 1000),
                    );

                    if (diffInMinutes <= 30) {
                        return {
                            code: 'ACCOUNT_IS_LOCKED',
                            status: HttpsStatus.UNAUTHORIZED,
                            errors: [
                                {
                                    location: 'body',
                                    param: 'email',
                                },
                            ],
                        };
                    } else {
                        account.failed_login = 0;
                    }
                }
            }

            const checkPass = bcrypt.compareSync(
                params.password.toString(),
                account.password,
            );

            if (checkPass) {
                const { id, email, name } = account;
                const roles = [account.roles as unknown as string];
                const accessToken = await this.Token.accessToken({
                    id,
                    email,
                    name,
                    roles,
                });

                const refreshToken =
                    await this.Token.refreshToken(id);
                const data = {
                    ...{
                        ...account.toJSON(),
                        _id: undefined,
                        password: undefined,
                        is_deleted: undefined,
                        type: undefined,
                    },

                    access_token: accessToken.token,
                    refresh_token: refreshToken.token,
                    roles: account.roles,
                };

                account.failed_login = 0;
                await account.save();
                return success.ok(data);
            } else {
                account.failed_login += 1;
                await account.save();
                return error.invalidData({
                    location: 'password',
                    message: 'wrong email or password',
                });
            }
        } catch (e) {
            throw e;
        }
    }
}
