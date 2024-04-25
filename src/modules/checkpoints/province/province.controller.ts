import {
    Controller,
    Delete,
    Get,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';
  import { CommandBus, QueryBus } from '@nestjs/cqrs';
  import { FormDataRequest } from 'nestjs-form-data';
  import { Permissions } from 'src/common/decorators/permission.decorator';
  import {
    PermissionGroup,
    PermissionName,
  } from 'src/common/enum/permission.enum';
import { CreateProvinceDto, CreateProvinceDtoType } from './dtos/create-province.dto';
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { CreateBannerCommand } from 'src/modules/banners/hero/commands/impl/create-command';
import { CreateProvinceCommand } from './commands/impl/create-province.command';
  
  @Controller('provinces')
  export class ProvinceController {
    constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}
  
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
  
    // @Permissions(PermissionGroup.Banner, PermissionName.Write)
    // @Put(':id')
    // @FormDataRequest()
    // async update(
    //   @Valibot({ schema: UpdateProvinceDto }) input: UpdateBannerDtoType,
    //   @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    // ) {
    //   const result = await this._commandBus.execute<UpdateBannerCommand>(
    //     new UpdateBannerCommand(params.id, input),
    //   );
    //   return { message: result };
    // }
  
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
  
    // @Permissions(PermissionGroup.Banner, PermissionName.Read)
    // @Get()
    // async get(
    //   @Valibot({ schema: QueryBannerDto, type: 'query' })
    //   query: QueryBannerType,
    // ) {
    //   return await this._queryBus.execute<GetAllBannerQuery>(
    //     new GetAllBannerQuery(query),
    //   );
    // }
  
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
  
    // @Permissions(PermissionGroup.Banner, PermissionName.Remove)
    // @Delete(':id')
    // async remove(
    //   @Valibot({ schema: GetByIdDto, type: 'params' })
    //   params: GetByIdDtoType,
    // ) {
    //   const result = await this._commandBus.execute<RemoveBannerCommand>(
    //     new RemoveBannerCommand(params.id),
    //   );
    //   return { message: result };
    // }
  }
  