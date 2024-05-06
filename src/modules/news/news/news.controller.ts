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
import { CreateNewsCommand } from './commands/impl/create-news.command';
import { RemoveNewsCommand } from './commands/impl/remove-news.command';
import { UpdateNewsCommand } from './commands/impl/update-news.command';
import { CreateNewsDto, CreateNewsDtoType } from './dtos/create-news.dto';
import { QueryNewsDto, QueryNewsDtoType } from './dtos/query-news.dto';
import { UpdateNewsDto, UpdateNewsDtoType } from './dtos/update-news.dto';
import { GetNewsDetailQuery } from './queries/impl/get-news-detail.query';
import { GetNewsOffsetBasePaginateQuery } from './queries/impl/get-news-offset-base-paginate.query';

@Controller('news')
export class NewsController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Permissions(PermissionGroup.News, PermissionName.Write)
  @FormDataRequest()
  @Post()
  async created(@Valibot({ schema: CreateNewsDto }) input: CreateNewsDtoType) {
    const res = await this._commandBus.execute<CreateNewsCommand>(
      new CreateNewsCommand(input),
    );
    return { message: res };
  }

  @Permissions(PermissionGroup.News, PermissionName.Write)
  @FormDataRequest()
  @Put(':id')
  async update(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @Valibot({ schema: UpdateNewsDto }) input: UpdateNewsDtoType,
  ) {
    const res = await this._commandBus.execute<UpdateNewsCommand>(
      new UpdateNewsCommand(params.id, input),
    );
    return { message: res };
  }

  @Permissions(PermissionGroup.News, PermissionName.Read)
  @Get()
  async getOffsetBasePaginate(
    @Valibot({ schema: QueryNewsDto, type: 'query' })
    query: QueryNewsDtoType,
  ) {
    return await this._queryBus.execute<GetNewsOffsetBasePaginateQuery>(
      new GetNewsOffsetBasePaginateQuery(query),
    );
  }

  @Permissions(PermissionGroup.News, PermissionName.Read)
  @Get(':id')
  async getDetail(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetNewsDetailQuery>(
      new GetNewsDetailQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.News, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<RemoveNewsCommand>(
      new RemoveNewsCommand(params.id),
    );
    return { message: result };
  }
}
