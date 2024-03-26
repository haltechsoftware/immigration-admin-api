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
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { MergeDrizzleToReqInterceptor } from 'src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor';
import { Valibot } from '../../../common/decorators/valibot/valibot.decorator';
import CreatePopupCommand from './command/impl/create-popup.command';
import DeletePopupCommand from './command/impl/delete-popup.command';
import UpdatePopupCommand from './command/impl/update-popup.command';
import UpdatePrivatePopupCommand from './command/impl/update-private-popup.command';
import { CreatePopupDto, CreatePopupDtoType } from './dto/create-popup.dto';
import { QueryPopupDto, QueryPopupDtoType } from './dto/query-popup.dto';
import { UpdatePopupDto, UpdatePopupDtoType } from './dto/update-popup.dto';
import {
  UpdatePrivatePopupDto,
  UpdatePrivatePopupDtoType,
} from './dto/update-private.dto';
import GetPopupByIdQuery from './queries/impl/get-popup-by-id.query';
import GetPopupQuery from './queries/impl/get-popup.query';

@Controller('popup')
export class PopupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Banner, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryPopupDto, type: 'query' })
    query: QueryPopupDtoType,
  ) {
    return await this.queryBus.execute<GetPopupQuery>(new GetPopupQuery(query));
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Write)
  @FormDataRequest()
  @Post()
  async create(@Valibot({ schema: CreatePopupDto }) body: CreatePopupDtoType) {
    const res = await this.commandBus.execute<CreatePopupCommand>(
      new CreatePopupCommand(body),
    );

    return { message: res };
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Write)
  @FormDataRequest()
  @Put(':id')
  async update(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @Valibot({ schema: UpdatePopupDto }) body: UpdatePopupDtoType,
  ) {
    const res = await this.commandBus.execute<UpdatePopupCommand>(
      new UpdatePopupCommand(params.id, body),
    );

    return { message: res };
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Read)
  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GetPopupByIdQuery>(
      new GetPopupByIdQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Remove)
  @Delete(':id')
  async delete(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const res = await this.commandBus.execute<DeletePopupCommand>(
      new DeletePopupCommand(params.id),
    );

    return { message: res };
  }

  @Permissions(PermissionGroup.Banner, PermissionName.Write)
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Put(':id/change-status')
  async updatePrivate(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @Valibot({ schema: UpdatePrivatePopupDto })
    body: UpdatePrivatePopupDtoType,
  ) {
    const res = await this.commandBus.execute<UpdatePrivatePopupCommand>(
      new UpdatePrivatePopupCommand(params.id, body),
    );

    return { message: res };
  }
}
