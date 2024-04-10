import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FormDataRequest } from "nestjs-form-data";
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { Permissions } from 'src/common/decorators/permission.decorator';
import { PermissionGroup, PermissionName } from "src/common/enum/permission.enum";
import { CreateVisaCategoryDto, CreateVisaCategoryDtoType } from "./dto/create.visa_category.dto";
import CreateVisaCategoryCommand from "./command/impl/create-visa_category.command";
import { GetByIdDto, GetByIdDtoType } from "src/common/dtos/get-by-id.dto";
import { GetOneVisaCategoryQuery } from "./queries/impl/get-visa_category-by-id.query";
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from "src/common/dtos/offset-base-paginate.dto";
import GetVisaCategoryQuery from "./queries/impl/get-visa_category-all.query";
import { UpdateVisaCategoryDto, UpdateVisaCategoryType } from "./dto/update-visa_category.dto";
import { UpdateVisaCategoryCommand } from "./command/impl/update-visa_category.command";
import { RemoveVisaCategoryCommand } from "./command/impl/remove-visa_category.command";

@Controller('visa-category')
export class VisaController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Visa, PermissionName.Write)
  @FormDataRequest()
  @Post()
  async create(@Valibot({ schema: CreateVisaCategoryDto }) body: CreateVisaCategoryDtoType) {
    const res = await this._commandBus.execute<CreateVisaCategoryCommand>(
      new CreateVisaCategoryCommand(body),
    );

    return { message: res };
  }

  @Permissions(PermissionGroup.Visa, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneVisaCategoryQuery>(
      new GetOneVisaCategoryQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.Visa, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    query: OffsetBasePaginateDtoType,
  ) {
    return await this._queryBus.execute<GetVisaCategoryQuery>(new GetVisaCategoryQuery(query));
  }

  @Permissions(PermissionGroup.Visa, PermissionName.Write)
  @Put(':id')
  @FormDataRequest()
  async update(
    @Valibot({ schema: UpdateVisaCategoryDto }) input: UpdateVisaCategoryType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdateVisaCategoryCommand>(
      new UpdateVisaCategoryCommand(params.id, input),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.Visa, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<RemoveVisaCategoryCommand>(
      new RemoveVisaCategoryCommand(params.id),
    );
    
    return { message: result };
  }
}