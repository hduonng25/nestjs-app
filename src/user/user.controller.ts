import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserBody, FindReqQuery, UpdateUserBody } from './dto';
import { Result } from 'src/shared/result';
import { Roles } from 'src/shared/guards';

@Controller('user')
export class UserController {
    constructor(
        @Inject('USER_SERVICE') private readonly UserService: UserService,
    ) {}

    @Get()
    @Roles(['ADMIN']) //==> roles.decorator nhan vao 1 role ["ADMIN"]
    public async findUser(@Query() params: FindReqQuery) {
        return this.UserService.findUser(params);
    }

    @Get(':id')
    public async findById(@Param('id') id: string): Promise<Result> {
        return this.UserService.getById({ id });
    }

    @Post()
    public async cerated(
        @Body() createUserBody: CreateUserBody,
    ): Promise<Result> {
        const body = CreateUserBody.plainInToClass(createUserBody);
        //Su dung plainInToClass() de xoa di nhung ham thua trong req gui ve de tranh lam crack db

        return this.UserService.created({ ...body });
    }

    @Put('update')
    @Roles(['ADMIN'])
    public async update(@Body() body: UpdateUserBody) {
        return this.UserService.update({ ...body });
    }

    @Put('delete')
    @Roles(['ADMIN'])
    public async deleled(@Body('ids') ids: string[]) {
        return this.UserService.deleted({ ids });
    }
}
