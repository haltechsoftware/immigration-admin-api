import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { CreateCheckPointCategoryCommand } from './commands/impl/create.command';
import { DeleteCheckpointCategoryCommand } from './commands/impl/delete.command';
import { UpdateCheckpointCategoryCommand } from './commands/impl/update.command';
import {
  CreateCheckpointCategoryDto,
  CreateCreateCheckpointCategoryDtoType,
} from './dtos/create.dto';

import {
  QueryCheckpointCategoryDto,
  QueryCheckpointCategoryDtoType,
} from './dtos/query.dto';

import {
  UpdateCheckpointCategoryDto,
  UpdateCheckpointCategoryDtoType,
} from './dtos/update.dto';
import { GetAllCheckpointCategoryCommand } from './queries/impl/get-all';
import { GetOneCheckpointCategoryCommand } from './queries/impl/get-one';

@Controller('checkpoint-categories')
export class CheckpointCategoryController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @Post()
  async create(
    @Valibot({ schema: CreateCheckpointCategoryDto })
    input: CreateCreateCheckpointCategoryDtoType,
  ) {
    const message =
      await this._commandBus.execute<CreateCheckPointCategoryCommand>(
        new CreateCheckPointCategoryCommand(input),
      );

    return { message };
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @Put(':id')
  async update(
    @Valibot({ schema: UpdateCheckpointCategoryDto })
    input: UpdateCheckpointCategoryDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const message =
      await this._commandBus.execute<UpdateCheckpointCategoryCommand>(
        new UpdateCheckpointCategoryCommand(params.id, input),
      );
    return { message };
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryCheckpointCategoryDto, type: 'query' })
    query: QueryCheckpointCategoryDtoType,
  ) {
    return await this._queryBus.execute<GetAllCheckpointCategoryCommand>(
      new GetAllCheckpointCategoryCommand(query),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneCheckpointCategoryCommand>(
      new GetOneCheckpointCategoryCommand(params.id),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const message =
      await this._commandBus.execute<DeleteCheckpointCategoryCommand>(
        new DeleteCheckpointCategoryCommand(params.id),
      );
    return { message };
  }
}
