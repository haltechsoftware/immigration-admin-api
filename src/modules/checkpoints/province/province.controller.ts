import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { CreateProvinceCommand } from './commands/impl/create-province.command';
import { DeleteProvinceCommand } from './commands/impl/delete-province.command';
import { UpdateProvinceCommand } from './commands/impl/update-province.command';
import {
  CreateProvinceDto,
  CreateProvinceDtoType,
} from './dtos/create-province.dto';

import {
  QueryProvinceDto,
  QueryProvinceDtoType,
} from './dtos/query.province.dto';
import {
  UpdateProvinceDto,
  UpdateProvinceDtoType,
} from './dtos/update-province.dto';
import { GetAllProvinceCommand } from './queries/impl/get-all.province';
import { GetOneProvinceCommand } from './queries/impl/get-one.province';

@Controller('provinces')
export class ProvinceController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Permissions(PermissionGroup.Provinces, PermissionName.Write)
  @Post()
  async create(
    @ValibotAsync({ schema: CreateProvinceDto }) input: CreateProvinceDtoType,
  ) {
    const message = await this._commandBus.execute<CreateProvinceCommand>(
      new CreateProvinceCommand(input),
    );

    return { message };
  }

  @Permissions(PermissionGroup.Provinces, PermissionName.Write)
  @Put(':id')
  async update(
    @Valibot({ schema: UpdateProvinceDto }) input: UpdateProvinceDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const message = await this._commandBus.execute<UpdateProvinceCommand>(
      new UpdateProvinceCommand(params.id, input),
    );
    return { message };
  }

  @Permissions(PermissionGroup.Provinces, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryProvinceDto, type: 'query' })
    query: QueryProvinceDtoType,
  ) {
    return await this._queryBus.execute<GetAllProvinceCommand>(
      new GetAllProvinceCommand(query),
    );
  }

  @Permissions(PermissionGroup.Provinces, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneProvinceCommand>(
      new GetOneProvinceCommand(params.id),
    );
  }

  @Permissions(PermissionGroup.Provinces, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const message = await this._commandBus.execute<DeleteProvinceCommand>(
      new DeleteProvinceCommand(params.id),
    );
    return { message };
  }
}
