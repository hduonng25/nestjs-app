import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas';
import { Result, error, success } from 'src/shared/result';
import { ParseSyntaxError, parseQuery, parseSort } from 'src/shared/mquery';
import { CreateUserBody, FindReqQuery, UpdateUserBody } from './dto';
import { v1 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { HttpError } from 'src/shared/error';
import { checkUser } from './middleware/check';
import { HttpsStatus } from 'src/constant';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly UserModel: Model<User>,

        @Inject('CHECK_USER')
        private readonly checkUser: checkUser,
    ) {}

    //TODO: internal
    async findUser(params: FindReqQuery): Promise<Result> {
        let filter: FilterQuery<User> = {
            is_deleted: false,
        };

        let sort: Record<string, 1 | -1> = { created_date: -1 };

        params.page = params.page === undefined ? 1 : params.page;
        params.size = params.size === undefined ? 10 : params.size;

        try {
            if (params.query) {
                const uFilter = parseQuery(params.query);
                filter = { $and: [filter, uFilter] };
            }
            params.sort && (sort = parseSort(params.sort));
        } catch (e) {
            const err = e as unknown as ParseSyntaxError;
            const value =
                err.message === params.sort ? params.sort : params.query;
            throw new HttpError({
                status: HttpsStatus.BAD_REQUEST,
                code: 'INVALID_DATA',
                description: {
                    en: 'invalid data',
                    vi: 'du lieu dau vao khong hop le',
                },
                errors: [
                    {
                        location: 'query',
                        param: err.type,
                        message: err.message,
                        value: value,
                    },
                ],
            });
        }

        const project = {
            _id: 0,
            id: 1,
            name: 1,
            email: 1,
            password: 1,
        };

        params.page = params.page <= 0 ? 1 : params.page;

        const facetData =
            params.size == -1
                ? []
                : [
                      { $skip: (params.page - 1) * params.size },
                      { $limit: params.size * 1 },
                  ];

        const facet = {
            meta: [{ $count: 'total' }],
            data: facetData,
        };

        Object.assign(filter, { is_deleted: false });

        const pipelane: PipelineStage[] = [
            { $match: filter },
            { $project: project },
            { $sort: sort },
            { $facet: facet },
        ];

        const user = await this.UserModel.aggregate(pipelane)
            .collation({ locale: 'vi' })
            .then((res) => res[0])
            .then(async (res) => {
                const total = !(res.meta.length > 0) ? 0 : res.meta[0].total;

                let totaPage = Math.ceil(total / params.size);
                totaPage = totaPage > 0 ? totaPage : 1;

                return {
                    page: Number(params.page),
                    total: total,
                    total_page: totaPage,
                    data: res.data,
                };
            });
        return success.ok(user);
    }

    async getById(params: { id: string }): Promise<Result> {
        const filter: FilterQuery<User> = {
            id: params.id,
            is_deleted: false,
        };

        const project = {
            _id: 0,
            id: 1,
            name: 1,
            email: 1,
        };

        const pipeline: PipelineStage[] = [
            { $match: filter },
            { $project: project },
        ];

        const user = await this.UserModel.aggregate(pipeline);

        if (user.length > 0) {
            return success.ok(user);
        } else {
            return error.commonError({
                location: 'user',
                message: 'user not found',
            });
        }
    }

    async created(params: CreateUserBody): Promise<Result> {
        const existingUser = await this.UserModel.findOne({
            email: params.email,
        });

        if (existingUser) {
            return error.commonError({
                location: 'email',
                message: `Email ${params.email} already exists`,
            });
        }

        try {
            const user = new this.UserModel({
                id: v1(),
                name: params.name,
                email: params.email,
                password: await bcrypt.hash(params.password.toString(), 10),
                roles: params.roles,
            });

            await user.save();
            return success.created(user);
        } catch (e) {
            return error.exception(e);
        }
    }

    async update(params: UpdateUserBody): Promise<Result> {
        await this.checkUser.checkExits({
            id: params.id,
            email: params.email,
        });
        const update = {
            name: params.name,
            roles: params.roles,
            email: params.email,
        };

        const user = await this.UserModel.findOneAndUpdate(
            { id: params.id, is_deleted: false },
            { $set: update },
            { nw: true },
        );

        return success.ok(user);
    }

    async deleted(params: { ids: string[] }): Promise<Result> {
        for (const id of params.ids) {
            const user = await this.UserModel.findOneAndUpdate(
                { id: id, is_deleted: false },
                { $set: { is_deleted: true } },
            );
            if (!user) {
                return error.commonError({
                    location: 'user',
                    message: 'khong tim thay user tuong ung',
                });
            }
        }

        return success.ok({
            mess: 'delete successfuly',
        });
    }

    //TODO: external
    public async findOne(email: string): Promise<User> {
        const user = await this.UserModel.findOne({
            email: email,
            is_deleted: false,
        });

        if (!user) {
            throw new HttpError({
                status: HttpsStatus.BAD_REQUEST,
                code: 'NOT_FOUND',
                description: {
                    en: 'not found',
                    vi: 'user khong ton tai',
                },
                errors: [
                    {
                        location: 'user',
                        param: email,
                        message: 'user khong ton tai',
                        value: 'email',
                    },
                ],
            });
        } else {
            return user;
        }
    }
}
