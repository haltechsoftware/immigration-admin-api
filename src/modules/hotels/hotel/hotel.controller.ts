import { Controller, Delete, Get, Post, Put, UseInterceptors } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FormDataRequest } from "nestjs-form-data";
import { PermissionGroup, PermissionName } from '../../../common/enum/permission.enum';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import { CreateHotelDto, CreateHotelDtoType } from "./dtos/create-hotel.dto";
import CreateHotelCommand from "./commands/imp/create-hotel.command";
import { UpdateHotelDto, UpdateHotelDtoType } from "./dtos/update-hotel.dto";
import { GetByIdDto, GetByIdDtoType } from "src/common/dtos/get-by-id.dto";
import UpdateHotelCommand from "./commands/imp/update-hotel.command";
import { QueryHotelDto, QueryHotelType } from "./dtos/query-hotel.dto";
import { GetAllHotelQuery } from "./queries/imp/get-all.query";
import { GetOneHotelQuery } from "./queries/imp/get-one.query";
import { MergeDrizzleToReqInterceptor } from "src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor";
import { UpdateHotelStatusDto, UpdatePopupStatusDtoType } from "./dtos/update-hotel-status.dto";
import { RemoveHotelCommand } from "./commands/imp/remove-hotel.command";
import { MergeParamToBodyInterceptor } from "src/common/interceptor/merge-param-to-body/merge-param-to-body.interceptor";
import { PublicHotelCommand } from "./commands/imp/public-hotel.command";
import { PrivateHotelCommand } from "./commands/imp/private-hotel.command";


@Controller('hotel')
export class HotelController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Hotel, PermissionName.Write)
  @FormDataRequest()
  @Post()
  async create(@Valibot({ schema: CreateHotelDto }) body: CreateHotelDtoType) {
    const res = await this.commandBus.execute<CreateHotelCommand>(
      new CreateHotelCommand(body),
    );

    return { message: res };
  }

  @Permissions(PermissionGroup.Hotel, PermissionName.Write)
  @FormDataRequest()
  @Put(':id')
  async update(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @Valibot({ schema: UpdateHotelDto }) body: UpdateHotelDtoType,
  ) {
    const res = await this.commandBus.execute<UpdateHotelCommand>(
      new UpdateHotelCommand(params.id, body),
    );

    return { message: res };
  }

  @Permissions(PermissionGroup.Hotel, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryHotelDto, type: 'query' })
    query: QueryHotelType,
  ) {
    return await this.queryBus.execute<GetAllHotelQuery>(
      new GetAllHotelQuery(query),
    );
  }

  @Permissions(PermissionGroup.Hotel, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GetOneHotelQuery>(
      new GetOneHotelQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.Hotel, PermissionName.Write)
  @Put(':id/public')
  @UseInterceptors(MergeParamToBodyInterceptor)
  async public(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this.commandBus.execute<PublicHotelCommand>(
      new PublicHotelCommand(params.id),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Hotel, PermissionName.Write)
  @Put(':id/private')
  @UseInterceptors(MergeParamToBodyInterceptor)
  async private(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this.commandBus.execute<PrivateHotelCommand>(
      new PrivateHotelCommand(params.id),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Hotel, PermissionName.Remove)
  @Delete(':id')
  async delete(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const res = await this.commandBus.execute<RemoveHotelCommand>(
      new RemoveHotelCommand(params.id),
    );

    return { message: res };
  }
}