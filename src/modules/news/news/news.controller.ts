import { Controller, Delete, Get, Post, Put, UseInterceptors } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ValibotAsync } from "src/common/decorators/valibot/valibot-async.decorator";
import { MergeDrizzleToReqInterceptor } from "src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor";
import { Permissions } from 'src/common/decorators/permission.decorator';
import { PermissionGroup, PermissionName } from "src/common/enum/permission.enum";
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { GetByIdDto, GetByIdDtoType } from "src/common/dtos/get-by-id.dto";
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from "src/common/dtos/offset-base-paginate.dto";
import { CreateNewsDto, CreateNewsDtoType } from "./dtos/create-news.dto";
import { CreateNewsCommand } from "./commands/impl/create-news.command";
import { FormDataRequest } from "nestjs-form-data";
import { GetNewsOffsetBasePaginateQuery } from "./queries/impl/get-news-offset-base-paginate.query";
import { GetNewsDetailQuery } from "./queries/impl/get-news-detail.query";
import { RemoveNewsCommand } from "./commands/impl/remove-news.command";
import { UpdateNewsDto, UpdateNewsDtoType } from "./dtos/update-news.dto";
import { UpdateNewsCommand } from "./commands/impl/update-news.command";

@Controller('news')
export class NewsController {
  constructor(
    private _commandBus: CommandBus,
    private _queryBus: QueryBus,
  ) { }

  @Permissions(PermissionGroup.News, PermissionName.Write)
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Post()
  async created(@ValibotAsync({ schema: CreateNewsDto }) input: CreateNewsDtoType) {
    const res = await this._commandBus.execute<CreateNewsCommand>(
      new CreateNewsCommand(input),
    );
    return { message: res };
  }

  @Permissions(PermissionGroup.News, PermissionName.Write)
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Put(':id')
  async update(
      @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
      @ValibotAsync({ schema: UpdateNewsDto }) input: UpdateNewsDtoType
  ) {
    
      const res = await this._commandBus.execute<UpdateNewsCommand>(
          new UpdateNewsCommand(params.id, input),
      );
      return { message: res }
  }

  @Permissions(PermissionGroup.News, PermissionName.Read)
  @Get()
  async getOffsetBasePaginate(
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    query: OffsetBasePaginateDtoType,
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