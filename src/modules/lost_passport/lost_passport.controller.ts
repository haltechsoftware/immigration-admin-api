import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { CreateLostPassportCommand } from './commands/impl/create-lost-passport.command';
import { DeletedLostPassportCommand } from './commands/impl/remove-lost-passport.command';
import { UpdatedLostPassportCommand } from './commands/impl/update-lost-passport.command';
import {
  CreateLostPassportDto,
  CreateLostPassportDtoType,
} from './dtos/create-lost-passport.dto';
import {
  QueryLostPassportByIdDto,
  QueryLostPassportByIdDtoType,
} from './dtos/query-lost-passport-by-id.dto';
import {
  QueryLostPassportDto,
  QueryLostPassportDtoType,
} from './dtos/query-lost-passport.dto';
import {
  UpdateLostPassportDto,
  UpdateLostPassportDtoType,
} from './dtos/update-lost-passport.dto';
import { GetDetailLostPassportQuery } from './queries/impl/get-detail-lost-passport.query';
import { GetLostPassportByIdQuery } from './queries/impl/get-lost-passport-by-id.query';
import { GetPaginateLostPassportQuery } from './queries/impl/get-paginate-lost-passport';

@Controller('lost-passport')
export class LostPassportController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Permissions(PermissionGroup.LostPassport, PermissionName.Write)
  @Post()
  async created(
    @Valibot({ schema: CreateLostPassportDto })
    input: CreateLostPassportDtoType,
  ) {
    const result = await this._commandBus.execute<CreateLostPassportCommand>(
      new CreateLostPassportCommand(input),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.LostPassport, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryLostPassportDto, type: 'query' })
    query: QueryLostPassportDtoType,
  ) {
    return await this._queryBus.execute<GetPaginateLostPassportQuery>(
      new GetPaginateLostPassportQuery(query),
    );
  }

  @Permissions(PermissionGroup.LostPassport, PermissionName.Read)
  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetLostPassportByIdQuery>(
      new GetLostPassportByIdQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.LostPassport, PermissionName.Read)
  @Get(':id/detail')
  async getDetail(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryLostPassportByIdDto, type: 'query' })
    query: QueryLostPassportByIdDtoType,
  ) {
    return await this._queryBus.execute<GetDetailLostPassportQuery>(
      new GetDetailLostPassportQuery(params.id, query),
    );
  }

  @Permissions(PermissionGroup.LostPassport, PermissionName.Write)
  @Put(':id')
  async updated(
    @Valibot({ schema: UpdateLostPassportDto })
    input: UpdateLostPassportDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdatedLostPassportCommand>(
      new UpdatedLostPassportCommand(params.id, input),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.LostPassport, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<DeletedLostPassportCommand>(
      new DeletedLostPassportCommand(params.id),
    );
    return { message: result };
  }
}
