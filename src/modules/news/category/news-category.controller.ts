import { Controller, Delete, Get, Post, Put, UseInterceptors } from "@nestjs/common";
import { CreateNewsCategorytDto, CreateNewsCategorytDtoType } from "./dtos/create-news-category.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateNewsCategoryCommand } from "./commands/impl/create-news-category.command";
import { ValibotAsync } from "src/common/decorators/valibot/valibot-async.decorator";
import { MergeDrizzleToReqInterceptor } from "src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor";
import { Permissions } from 'src/common/decorators/permission.decorator';
import { PermissionGroup, PermissionName } from "src/common/enum/permission.enum";
import { UpdateNewsCategorytDto, UpdateNewsCategorytDtoType } from "./dtos/update-news-cateory.dto";
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { GetByIdDto, GetByIdDtoType } from "src/common/dtos/get-by-id.dto";
import { UpdateNewsCategoryCommand } from "./commands/impl/update-news-category.command";
import { RemoveNewsCategoryCommand } from "./commands/impl/remove-news-category.command";
import { GetNewsCategoryOffsetBasePaginateQuery } from "./queries/impl/news-category-get-paginate";
import { GetNewsCategoryById } from "./queries/impl/news-category-get-by-id";
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from "src/common/dtos/offset-base-paginate.dto";

@Controller('news-categories')
export class NewsCategoryController {
    constructor(
        private _commandBus: CommandBus,
        private _queryBus: QueryBus,
    ) { }

    @Permissions(PermissionGroup.News, PermissionName.Write)
    @UseInterceptors(MergeDrizzleToReqInterceptor)
    @Post()
    async created(@ValibotAsync({ schema: CreateNewsCategorytDto }) input: CreateNewsCategorytDtoType) {
        const res = await this._commandBus.execute<CreateNewsCategoryCommand>(
            new CreateNewsCategoryCommand(input),
        );
        return { message: res };
    }

    @Permissions(PermissionGroup.News, PermissionName.Write)
    @UseInterceptors(MergeDrizzleToReqInterceptor)
    @Put(':id')
    async update(
        @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
        @ValibotAsync({ schema: UpdateNewsCategorytDto }) input: UpdateNewsCategorytDtoType
    ) {
        const res = await this._commandBus.execute<UpdateNewsCategoryCommand>(
            new UpdateNewsCategoryCommand(params.id, input),
        );
        return { message: res }
    }

    @Permissions(PermissionGroup.News, PermissionName.Read)
    @Get()
    async getOffsetBasePaginate(
      @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
      query: OffsetBasePaginateDtoType,
    ) {
      return await this._queryBus.execute<GetNewsCategoryOffsetBasePaginateQuery>(
        new GetNewsCategoryOffsetBasePaginateQuery(query),
      );
    }

    @Permissions(PermissionGroup.News, PermissionName.Read)
    @Get(':id')
    async getById(
        @Valibot({ schema: GetByIdDto, type: 'params' })
        params: GetByIdDtoType,
      ) {
        return await this._queryBus.execute<GetNewsCategoryById>(
          new GetNewsCategoryById(params.id),
        );
      }

    @Permissions(PermissionGroup.News, PermissionName.Remove)
    @Delete(':id')
    async remove(
        @Valibot({ schema: GetByIdDto, type: 'params' })
        params: GetByIdDtoType,
    ) {
        const result = await this._commandBus.execute<RemoveNewsCategoryCommand>(
            new RemoveNewsCategoryCommand(params.id),
        );
        return { message: result };
    }
}