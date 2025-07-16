import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { CreateCheckPointCommand } from './commands/impl/create.command';
import { DeleteCheckpointCommand } from './commands/impl/delete.command';
import { UpdateCheckpointCommand } from './commands/impl/update.command';
import {
  CreateCheckpointDto,
  CreateCheckpointDtoType,
} from './dtos/create-checkpoint.dto';

import { QueryCheckpointDto, QueryCheckpointDtoType } from './dtos/query.dto';
import {
  UpdateCheckpointDto,
  UpdateCheckpointDtoType,
} from './dtos/update-country.dto';
import { GetAllCheckpointCommand } from './queries/impl/get-all';
import { GetOneCheckpointCommand } from './queries/impl/get-one';
import {
  QueryCheckpointClientDto,
  QueryCheckpointClientDtoType,
} from './dtos/query-client.dto';
import { GetAllCheckpointClientCommand } from './queries/impl/get-all-client';
import { Public } from 'src/common/decorators/public.decorator';
import {
  QueryProvinceCheckpointClientDto,
  QueryProvinceCheckpointClientDtoType,
} from './dtos/query-province-checkpoint.dto';
import { GetAllProvinceCheckpointCheckpointClientCommand } from './queries/impl/get-all-province-checkpoint-client';
import {
  QueryclientCheckpointDto,
  QueryClientCheckpointDtoType,
} from './dtos/query-client-checkinpoint.dto';
import { GetAllClientCheckpointCommand } from './queries/impl/get-all-client-checkpoint';
import { GetOneClientCheckpointCommand } from './queries/impl/get-one-client';
import {
  GetByIdClientDto,
  GetByIdClientDtoType,
} from './dtos/query-by-id-client';
import { GetAllCategoryClientCommand } from './queries/impl/get-category-client';
import {
  QueryCategoryClientDto,
  QueryCategoryClientDtoType,
} from './dtos/query-category-client.dto';
import {
  GetBySlugDto,
  GetBySlugDtoType,
} from '../../../common/dtos/get-by-slug.dto';

@Controller('checkpoint')
export class CheckpointController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @FormDataRequest()
  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @Post()
  async create(
    @Valibot({ schema: CreateCheckpointDto })
    input: CreateCheckpointDtoType,
  ) {
    const message = await this._commandBus.execute<CreateCheckPointCommand>(
      new CreateCheckPointCommand(input),
    );

    return { message };
  }

  @Public()
  @Get('country-checkpoint')
  async getToClient(
    @Valibot({ schema: QueryCheckpointClientDto, type: 'query' })
    query: QueryCheckpointClientDtoType,
  ) {
    return await this._queryBus.execute<GetAllCheckpointClientCommand>(
      new GetAllCheckpointClientCommand(query),
    );
  }

  @Public()
  @Get('province-checkpoint')
  async getProvinceOfCheckPointToClient(
    @Valibot({ schema: QueryProvinceCheckpointClientDto, type: 'query' })
    query: QueryProvinceCheckpointClientDtoType,
  ) {
    return await this._queryBus.execute<GetAllProvinceCheckpointCheckpointClientCommand>(
      new GetAllProvinceCheckpointCheckpointClientCommand(query),
    );
  }

  @Public()
  @Get('client/categories')
  async getCategoryToClient(
    @Valibot({ schema: QueryCategoryClientDto, type: 'query' })
    query: QueryCategoryClientDtoType,
  ) {
    return await this._queryBus.execute<GetAllCategoryClientCommand>(
      new GetAllCategoryClientCommand(query),
    );
  }

  @Public()
  @Get('client')
  async getCheckpointToClient(
    @Valibot({ schema: QueryclientCheckpointDto, type: 'query' })
    query: QueryClientCheckpointDtoType,
  ) {
    return await this._queryBus.execute<GetAllClientCheckpointCommand>(
      new GetAllClientCheckpointCommand(query),
    );
  }

  @Public()
  @Get('client/:slug')
  async findOneToClient(
    @Valibot({ schema: GetBySlugDto, type: 'params' })
    params: GetBySlugDtoType,
    @Valibot({ schema: GetByIdClientDto, type: 'query' })
    query: GetByIdClientDtoType,
  ) {
    return await this._queryBus.execute<GetOneClientCheckpointCommand>(
      new GetOneClientCheckpointCommand(params.slug, query),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @FormDataRequest()
  @Put(':id')
  async update(
    @Valibot({ schema: UpdateCheckpointDto })
    input: UpdateCheckpointDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    console.log('input', input);
    const message = await this._commandBus.execute<UpdateCheckpointCommand>(
      new UpdateCheckpointCommand(params.id, input),
    );
    return { message };
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryCheckpointDto, type: 'query' })
    query: QueryCheckpointDtoType,
  ) {
    return await this._queryBus.execute<GetAllCheckpointCommand>(
      new GetAllCheckpointCommand(query),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneCheckpointCommand>(
      new GetOneCheckpointCommand(params.id),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const message = await this._commandBus.execute<DeleteCheckpointCommand>(
      new DeleteCheckpointCommand(params.id),
    );
    return { message };
  }
}
