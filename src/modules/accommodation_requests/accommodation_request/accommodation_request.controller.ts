import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { Permissions } from 'src/common/decorators/permission.decorator';
import {
  CreateAccommodationRequestDto,
  CreateAccommodationRequestDtoType,
} from './dtos/create-accommodation_request.dto';
import { CreateAccommodationRequestCommand } from './commands/impl/create-accommodation_request.command';
import {
  UpdateAccommodationRequestDto,
  UpdateAccommodationRequestDtoType,
} from './dtos/update-accommodation_request.dto';
import { UpdatedAccommodationCommand } from './commands/impl/update-accommodation_request.command';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import { DeletedAccommodationCommand } from './commands/impl/remove-accommodation_request.command';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import {
  OffsetBasePaginateDto,
  OffsetBasePaginateDtoType,
} from 'src/common/dtos/offset-base-paginate.dto';
import { GetPaginateAccommodationRequest } from './queries/impl/get-paginate-accommodation_request';
import { GetDetailAccommodationRequest } from './queries/impl/get-detail-accommodation_request';
import { query } from 'express';

@Controller('accommodation-request')
export class AccommodationRequestController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}
  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Write)
  @Post()
  async created(
    @Valibot({ schema: CreateAccommodationRequestDto })
    input: CreateAccommodationRequestDtoType,
  ) {
    return await this._commandBus.execute<CreateAccommodationRequestCommand>(
      new CreateAccommodationRequestCommand(input),
    );
  }

  //**** get paginate */
  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    query: OffsetBasePaginateDtoType,
  ) {
    return await this._queryBus.execute<GetPaginateAccommodationRequest>(
      new GetPaginateAccommodationRequest(query),
    );
  }

  //**** get detail */
  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Read)
  @Get(':id')
  async getPaginate(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetDetailAccommodationRequest>(
      new GetDetailAccommodationRequest(params.id),
    );
  }

  //**** updated  */
  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Write)
  @Put(':id')
  async updated(
    @Valibot({ schema: UpdateAccommodationRequestDto })
    input: UpdateAccommodationRequestDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    return await this._commandBus.execute<UpdatedAccommodationCommand>(
      new UpdatedAccommodationCommand(params.id, input),
    );
  }

  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<DeletedAccommodationCommand>(
      new DeletedAccommodationCommand(params.id),
    );
    return { message: result };
  }
}
