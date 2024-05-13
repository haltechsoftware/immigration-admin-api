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

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @FormDataRequest()
  @Put(':id')
  async update(
    @Valibot({ schema: UpdateCheckpointDto })
    input: UpdateCheckpointDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
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
