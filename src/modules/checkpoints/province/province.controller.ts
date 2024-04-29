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

  // @Permissions(PermissionGroup.Banner, PermissionName.Write)
  // @Put(':id/private')
  // @UseInterceptors(MergeParamToBodyInterceptor)
  // async private(
  //   @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  // ) {
  //   const result = await this._commandBus.execute<PrivateBannerCommand>(
  //     new PrivateBannerCommand(params.id),
  //   );
  //   return { message: result };
  // }

  // @Permissions(PermissionGroup.Banner, PermissionName.Write)
  // @Put(':id/public')
  // @UseInterceptors(MergeParamToBodyInterceptor)
  // async public(
  //   @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  // ) {
  //   const result = await this._commandBus.execute<PublicBannerCommand>(
  //     new PublicBannerCommand(params.id),
  //   );
  //   return { message: result };
  // }

  @Permissions(PermissionGroup.Provinces, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryProvinceDto, type: 'query' })
    query: QueryProvinceDtoType,
  ) {
    return await this._queryBus.execute<GetAllProvinceCommand>(
      new GetAllProvinceCommand(query),
    );
  }

  // @Permissions(PermissionGroup.Banner, PermissionName.Read)
  // @Get(':id')
  // async findOne(
  //   @Valibot({ schema: GetByIdDto, type: 'params' })
  //   params: GetByIdDtoType,
  // ) {
  //   return await this._queryBus.execute<GetOneBannerQuery>(
  //     new GetOneBannerQuery(params.id),
  //   );
  // }

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
