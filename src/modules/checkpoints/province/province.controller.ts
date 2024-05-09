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
import { CreateProvinceDto, CreateProvinceDtoType } from './dtos/create-province.dto';
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { CreateProvinceCommand } from './commands/impl/create-province.command';
import { MergeDrizzleToReqInterceptor } from 'src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { UpdateProvinceDto, UpdateProvinceDtoType } from './dtos/update-province.dto';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import { UpdateProvinceCommand } from './commands/impl/update-province.command';
import { DeleteProvinceCommand } from './commands/impl/delete-province.command';
import { QueryProvinceDto, QueryProvinceDtoType } from './dtos/query.province.dto';
import { GetAllProvinceCommand } from './queries/impl/get-all.province';
import { GetOneProvinceCommand } from './queries/impl/get-one.province';
import { QueryProvinceByIdDto, QueryProvinceByIdDtoType } from './dtos/query-province-by-id.dto';
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from 'src/common/dtos/offset-base-paginate.dto';

@Controller('provinces')
export class ProvinceController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Permissions(PermissionGroup.Provinces, PermissionName.Write)
  @Post()
  async create(
    @ValibotAsync({ schema: CreateProvinceDto }) input: CreateProvinceDtoType,
  ) {
    const result = await this._commandBus.execute<CreateProvinceCommand>(
      new CreateProvinceCommand(input),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.Provinces, PermissionName.Write)
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Put(':id')
  async update(
    @ValibotAsync({ schema: UpdateProvinceDto }) input: UpdateProvinceDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdateProvinceCommand>(
      new UpdateProvinceCommand(params.id, input),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Provinces, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryProvinceDto, type: 'query' })
    query: QueryProvinceDtoType,
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    paginate: OffsetBasePaginateDtoType,
  ) {
    return await this._queryBus.execute<GetAllProvinceCommand>(
      new GetAllProvinceCommand(query, paginate),
    );
  }

  @Permissions(PermissionGroup.Provinces, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryProvinceByIdDto, type: 'query' })
    query: QueryProvinceByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneProvinceCommand>(
      new GetOneProvinceCommand(params.id, query),
    );
  }

  @Permissions(PermissionGroup.Provinces, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<DeleteProvinceCommand>(
      new DeleteProvinceCommand(params.id),
    );
    return { message: result };
  }
}
