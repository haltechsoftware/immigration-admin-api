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
import { CreateCheckpointCategoryDto, CreateCreateCheckpointCategoryDtoType } from './dtos/create.dto';
import { CreateCheckPointCategoryCommand } from './commands/impl/create.command';
import { UpdateCheckpointCategoryDto, UpdateCheckpointCategoryDtoType } from './dtos/update-country.dto';
import { UpdateCheckpointCategoryCommand } from './commands/impl/update.command';
import { DeleteCheckpointCategoryCommand } from './commands/impl/delete.command';
import { QueryCheckpointCategoryDto, QueryCheckpointCategoryDtoType } from './dtos/query.dto';
import { GetAllCheckpointCategoryCommand } from './queries/impl/get-all';
import { QueryCheckpointCategoryByIdDto, QueryCheckpointCategoryByIdDtoType } from './dtos/query-by-id.dto';
import { GetOneCheckpointCategoryCommand } from './queries/impl/get-one';
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from 'src/common/dtos/offset-base-paginate.dto';

@Controller('checkpoint-categories')
export class CheckpointCategoryController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @Post()
  async create(
    @ValibotAsync({ schema: CreateCheckpointCategoryDto }) input: CreateCreateCheckpointCategoryDtoType,
  ) {
    const result = await this._commandBus.execute<CreateCheckPointCategoryCommand>(
      new CreateCheckPointCategoryCommand(input),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Write)
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Put(':id')
  async update(
    @ValibotAsync({ schema: UpdateCheckpointCategoryDto }) input: UpdateCheckpointCategoryDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdateCheckpointCategoryCommand>(
      new UpdateCheckpointCategoryCommand(params.id, input),
    );
    return { message: result };
  }


  @Permissions(PermissionGroup.Checkpoint, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryCheckpointCategoryDto, type: 'query' })
    query: QueryCheckpointCategoryDtoType,
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    paginate: OffsetBasePaginateDtoType,
  ) {
    return await this._queryBus.execute<GetAllCheckpointCategoryCommand>(
      new GetAllCheckpointCategoryCommand(query, paginate),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryCheckpointCategoryByIdDto, type: 'query' })
    query: QueryCheckpointCategoryByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneCheckpointCategoryCommand>(
      new GetOneCheckpointCategoryCommand(params.id, query),
    );
  }

  @Permissions(PermissionGroup.Checkpoint, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<DeleteCheckpointCategoryCommand>(
      new DeleteCheckpointCategoryCommand(params.id),
    );
    return { message: result };
  }
}
