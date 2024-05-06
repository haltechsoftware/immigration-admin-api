import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import CreateVisaCategoryCommand from './command/impl/create-visa_category.command';
import { RemoveVisaCategoryCommand } from './command/impl/remove-visa_category.command';
import { UpdateVisaCategoryCommand } from './command/impl/update-visa_category.command';
import {
  CreateVisaCategoryDto,
  CreateVisaCategoryDtoType,
} from './dto/create.visa_category.dto';
import {
  QueryVisaCategoryDetailDto,
  QueryVisaCategoryDetailDtoType,
} from './dto/query-visa-category-detail.dto';
import {
  QueryVisaCategory,
  QueryVisaCategoryType,
} from './dto/query-visa-category.dto';
import {
  UpdateVisaCategoryDto,
  UpdateVisaCategoryType,
} from './dto/update-visa_category.dto';
import { GetVisaCategoryDetailQuery } from './queries/impl/get-visa-category-detail.query';
import GetVisaCategoryQuery from './queries/impl/get-visa_category-all.query';
import { GetOneVisaCategoryQuery } from './queries/impl/get-visa_category-by-id.query';

@Controller('visa-category')
export class VisaController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Visa, PermissionName.Write)
  @Post()
  async create(
    @Valibot({ schema: CreateVisaCategoryDto }) body: CreateVisaCategoryDtoType,
  ) {
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
  @Get(':id/detail')
  async getDetail(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryVisaCategoryDetailDto, type: 'query' })
    query: QueryVisaCategoryDetailDtoType,
  ) {
    return await this._queryBus.execute<GetVisaCategoryDetailQuery>(
      new GetVisaCategoryDetailQuery(params.id, query),
    );
  }

  @Permissions(PermissionGroup.Visa, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryVisaCategory, type: 'query' })
    query: QueryVisaCategoryType,
  ) {
    return await this._queryBus.execute<GetVisaCategoryQuery>(
      new GetVisaCategoryQuery(query),
    );
  }

  @Permissions(PermissionGroup.Visa, PermissionName.Write)
  @Put(':id')
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
