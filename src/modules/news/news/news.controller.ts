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
import { Public } from 'src/common/decorators/public.decorator';
import { GetNewsOffsetBasePaginateClientQuery } from './queries/impl/get-new-offset-base-paginate-client.query';
import { QueryClientNewsDto, QueryClientNewsDtoType } from './dtos/query-news-client.dto';
import { QueryNewsClientDto, QueryNewsClientDtoType } from './dtos/query-client.dto';
import { GetNewsClientOffsetBasePaginateQuery } from './queries/impl/get-new-to-client.query';
import { GetNewsCategoryOffsetBasePaginateClientQuery } from './queries/impl/get-new-category-all.query';
import { GetByIdClientDto, GetByIdClientDtoType } from 'src/modules/checkpoints/checkpoint/dtos/query-by-id-client';
import { GetOneClientNewsQuery } from './queries/impl/get-new-detail-client.query';
import { GetBySlugDto, GetBySlugDtoType } from 'src/common/dtos/get-by-slug.dto';

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

  @Public()
  @Get('home')
  async getOfClient(
    @Valibot({ schema: QueryClientNewsDto, type: 'query' })
    query: QueryClientNewsDtoType,
  ) {
    return await this._queryBus.execute<GetNewsOffsetBasePaginateClientQuery>(
      new GetNewsOffsetBasePaginateClientQuery(query),
    );
  }

  @Public()
  @Get('client')
  async getNewOfClient(
    @Valibot({ schema: QueryNewsClientDto, type: 'query' })
    query: QueryNewsClientDtoType,
  ) {
    return await this._queryBus.execute<GetNewsClientOffsetBasePaginateQuery>(
      new GetNewsClientOffsetBasePaginateQuery(query),
    );
  }

  @Public()
  @Get('client/:slug')
  async getNewDetailOfClient(
    // @Valibot({ schema: GetByIdDto, type: 'params' })
    // params: GetByIdDtoType,
    @Valibot({ schema: GetBySlugDto, type: 'params' })
    params: GetBySlugDtoType,
    @Valibot({ schema: GetByIdClientDto, type: 'query' })
    query: GetByIdClientDtoType,
  ) {
    return await this._queryBus.execute<GetOneClientNewsQuery>(
      new GetOneClientNewsQuery(params.slug, query),
    );
  }

  @Public()
  @Get('category/client')
  async getNewCategoryOfClient(
    @Valibot({ schema: QueryClientNewsDto, type: 'query' })
    query: QueryClientNewsDtoType,
  ) {
    return await this._queryBus.execute<GetNewsCategoryOffsetBasePaginateClientQuery>(
      new GetNewsCategoryOffsetBasePaginateClientQuery(query),
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
