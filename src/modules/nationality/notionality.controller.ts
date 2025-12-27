import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import {
  CreateNationalityDto,
  CreateNationalityDtoType,
} from './dto/create.dto';
import CreateNationalityCommand from './commands/impl/create.command';
import { Public } from 'src/common/decorators/public.decorator';
import { QueryNationality, QueryNationalityType } from './dto/query.dto';
import GetNationalityQuery from './queries/impl/get-all.query';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import { GetOneNationalityQuery } from './queries/impl/get-one.query';
import {
  UpdateNationalityDto,
  UpdateNationalityDtoType,
} from './dto/update.dto';
import UpdateNationalityCommand from './commands/impl/udpate.command';
import { RemoveNationalityCommand } from './commands/impl/delete.command';

@Controller('nationalities')
export class NationalityController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
  ) {}

  @Public()
  @Get()
  async getToClient(
    @Valibot({ schema: QueryNationality, type: 'query' })
    query: QueryNationalityType,
  ) {
    return await this._queryBus.execute<GetNationalityQuery>(
      new GetNationalityQuery(query),
    );
  }

  @Get(':id')
  async getOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneNationalityQuery>(
      new GetOneNationalityQuery(params.id),
    );
  }

  // @Permissions(PermissionGroup.Visa, PermissionName.Write)
  @Post()
  async create(
    @Valibot({ schema: CreateNationalityDto }) body: CreateNationalityDtoType,
  ) {
    const res = await this._commandBus.execute<CreateNationalityCommand>(
      new CreateNationalityCommand(body),
    );

    return { message: res };
  }

  // @Permissions(PermissionGroup.News, PermissionName.Write)
  @Put(':id')
  async update(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @Valibot({ schema: UpdateNationalityDto }) input: UpdateNationalityDtoType,
  ) {
    const res = await this._commandBus.execute<UpdateNationalityCommand>(
      new UpdateNationalityCommand(params.id, input),
    );
    return { message: res };
  }

  // @Permissions(PermissionGroup.News, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<RemoveNationalityCommand>(
      new RemoveNationalityCommand(params.id),
    );
    return { message: result };
  }
}
