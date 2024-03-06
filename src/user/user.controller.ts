import {
    Body,
    Controller,
    Get,
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
import { plainToClass } from '@nestjs/class-transformer';
import { User } from './schemas';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}

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
        @Body() body: CreateUserBody,
    ): Promise<Result> {
        const UserReal = plainToClass(CreateUserBody, User, {
            excludeExtraneousValues: true,
        });
        console.log(UserReal);

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
