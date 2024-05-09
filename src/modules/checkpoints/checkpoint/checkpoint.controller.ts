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
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { MergeDrizzleToReqInterceptor } from 'src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import { UpdateCheckpointCommand } from './commands/impl/update.command';
import { CreateCheckpointDto, CreateCheckpointDtoType } from './dtos/create-checkpoint.dto';
import { CreateCheckPointCommand } from './commands/impl/create.command';
import { FormDataRequest } from 'nestjs-form-data';
import { UpdateCheckpointDto, UpdateCheckpointDtoType } from './dtos/update-country.dto';
import { QueryCheckpointCategoryDto } from '../category/dtos/query.dto';
import { QueryCheckpointDto, QueryCheckpointDtoType } from './dtos/query.dto';
import { GetAllCheckpointCommand } from './queries/impl/get-all';
import { QueryCheckpointByIdDto, QueryCheckpointByIdDtoType } from './dtos/query-by-id.dto';
import { GetOneCheckpointCommand } from './queries/impl/get-one';
import { DeleteCheckpointCommand } from './commands/impl/delete.command';
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from 'src/common/dtos/offset-base-paginate.dto';

@Controller('checkpoint')
export class CheckpointController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @Post()
  async create(
    @ValibotAsync({ schema: CreateCheckpointDto }) input: CreateCheckpointDtoType,
  ) {
    const result = await this._commandBus.execute<CreateCheckPointCommand>(
      new CreateCheckPointCommand(input),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @FormDataRequest()
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Put(':id')
  async update(
    @ValibotAsync({ schema: UpdateCheckpointDto }) input: UpdateCheckpointDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdateCheckpointCommand>(
      new UpdateCheckpointCommand(params.id, input),
    );
    return { message: result };
  }


  @Permissions(PermissionGroup.Checkpoint, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryCheckpointDto, type: 'query' })
    query: QueryCheckpointDtoType,
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    paginate: OffsetBasePaginateDtoType,
  ) {
    return await this._queryBus.execute<GetAllCheckpointCommand>(
      new GetAllCheckpointCommand(query, paginate),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryCheckpointByIdDto, type: 'query' })
    query: QueryCheckpointByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneCheckpointCommand>(
      new GetOneCheckpointCommand(params.id, query),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<DeleteCheckpointCommand>(
      new DeleteCheckpointCommand(params.id),
    );
    return { message: result };
  }
}
