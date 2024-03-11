import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  OffsetBasePaginateDto,
  OffsetBasePaginateDtoType,
} from 'src/common/dtos/offset-base-paginate.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { MergeDrizzleToReqInterceptor } from 'src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor';
import CreateRoleCommand from './commands/impl/create-role.command';
import DeleteRoleCommand from './commands/impl/delete-role.command';
import UpdateRoleCommand from './commands/impl/update-role.command';
import { CreateRoleDto, CreateRoleDtoType } from './dtos/create-role.dto';
import { UpdateRoleDto, UpdateRoleDtoType } from './dtos/update-role.dto';
import GetRoleByIdQuery from './quries/impl/get-role-by-id.query';
import GetRoleQuery from './quries/impl/get-role.query';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions(PermissionGroup.User, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    query: OffsetBasePaginateDtoType,
  ) {
    return await this.queryBus.execute<GetRoleQuery>(new GetRoleQuery(query));
  }

  @Permissions(PermissionGroup.User, PermissionName.Write)
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Post()
  async create(
    @ValibotAsync({ schema: CreateRoleDto }) body: CreateRoleDtoType,
  ) {
    const result = await this.commandBus.execute<CreateRoleCommand, string>(
      new CreateRoleCommand(body),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.User, PermissionName.Read)
  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GetRoleByIdQuery>(
      new GetRoleByIdQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.User, PermissionName.Write)
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Put(':id')
  async update(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @ValibotAsync({ schema: UpdateRoleDto }) body: UpdateRoleDtoType,
  ) {
    const result = await this.commandBus.execute<UpdateRoleCommand, string>(
      new UpdateRoleCommand(params.id, body),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.User, PermissionName.Remove)
  @Delete(':id')
  async delete(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this.commandBus.execute<DeleteRoleCommand, string>(
      new DeleteRoleCommand(params.id),
    );

    return { message: result };
  }
}
