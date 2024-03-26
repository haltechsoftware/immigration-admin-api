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
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { MergeParamToBodyInterceptor } from 'src/common/interceptor/merge-param-to-body/merge-param-to-body.interceptor';
import { CreateBannerCommand } from './commands/impl/create-command';
import { PrivateBannerCommand } from './commands/impl/private-banner.command';
import { PublicBannerCommand } from './commands/impl/public-banner.command';
import { RemoveBannerCommand } from './commands/impl/remove-banner';
import { UpdateBannerCommand } from './commands/impl/updata-command';
import {
  CreateBannerHeroDto,
  CreateBannerHeroType,
} from './dtos/create-banner.dto';
import { QueryBannerDto, QueryBannerType } from './dtos/query-banner.dto';
import {
  UpdateBannerDtoType,
  UpdateBannerHeroDto,
} from './dtos/update-banner.dto';
import { GetAllBannerQuery } from './queries/impl/get-all.banner';
import { GetOneBannerQuery } from './queries/impl/get-one.banner';

@Controller('banner-hero')
export class BannerHeroController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Permissions(PermissionGroup.Banner, PermissionName.Write)
  @Post()
  @FormDataRequest()
  async create(
    @Valibot({ schema: CreateBannerHeroDto }) input: CreateBannerHeroType,
  ) {
    const result = await this._commandBus.execute<CreateBannerCommand>(
      new CreateBannerCommand(input),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Write)
  @Put(':id')
  @FormDataRequest()
  async update(
    @Valibot({ schema: UpdateBannerHeroDto }) input: UpdateBannerDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdateBannerCommand>(
      new UpdateBannerCommand(params.id, input),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Write)
  @Put(':id/private')
  @UseInterceptors(MergeParamToBodyInterceptor)
  async private(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<PrivateBannerCommand>(
      new PrivateBannerCommand(params.id),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Write)
  @Put(':id/public')
  @UseInterceptors(MergeParamToBodyInterceptor)
  async public(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<PublicBannerCommand>(
      new PublicBannerCommand(params.id),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryBannerDto, type: 'query' })
    query: QueryBannerType,
  ) {
    return await this._queryBus.execute<GetAllBannerQuery>(
      new GetAllBannerQuery(query),
    );
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneBannerQuery>(
      new GetOneBannerQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<RemoveBannerCommand>(
      new RemoveBannerCommand(params.id),
    );
    return { message: result };
  }
}
