import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  OffsetBasePaginateDto,
  OffsetBasePaginateDtoType,
} from 'src/common/dtos/offset-base-paginate.dto';
import { MergeDrizzleToReqInterceptor } from 'src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor';
import CreateUserCommand from './commands/impl/create-user.command';
import DeleteUserCommand from './commands/impl/delete-user.command';
import UpdateUserCommand from './commands/impl/update-user.command';
import { CreateUserDto, CreateUserDtoType } from './dtos/create-user.dto';
import { UpdateUserDto, UpdateUserDtoType } from './dtos/update-user.dto';
import GetUserByIdQuery from './queries/impl/get-user-by-id.query';
import GetUserQuery from './queries/impl/get-user.query';

@Controller('users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async get(
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    query: OffsetBasePaginateDtoType,
  ) {
    return await this.queryBus.execute<GetUserQuery>(new GetUserQuery(query));
  }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Post()
  async create(
    @ValibotAsync({ schema: CreateUserDto }) body: CreateUserDtoType,
  ) {
    const res = await this.commandBus.execute<CreateUserCommand>(
      new CreateUserCommand(body),
    );

    return { message: res };
  }

  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GetUserByIdQuery>(
      new GetUserByIdQuery(params.id),
    );
  }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Put(':id')
  async update(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @ValibotAsync({ schema: UpdateUserDto }) body: UpdateUserDtoType,
  ) {
    const res = await this.commandBus.execute<UpdateUserCommand>(
      new UpdateUserCommand(params.id, body),
    );

    return { message: res };
  }

  @Delete(':id')
  async delete(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const res = await this.commandBus.execute<DeleteUserCommand>(
      new DeleteUserCommand(params.id),
    );

    return { message: res };
  }
}
