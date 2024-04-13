import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { CreateAccommodationRequestCommand } from './commands/impl/create-accommodation-request.command';
import { DeletedAccommodationCommand } from './commands/impl/remove-accommodation-request.command';
import { UpdatedAccommodationCommand } from './commands/impl/update-accommodation-request.command';
import {
  CreateAccommodationRequestDto,
  CreateAccommodationRequestDtoType,
} from './dtos/create-accommodation-request.dto';
import {
  QueryAccommodationRequestByIdDto,
  QueryAccommodationRequestByIdDtoType,
} from './dtos/query-accommodation-request-by-id.dto';
import {
  QueryAccommodationRequestDto,
  QueryAccommodationRequestDtoType,
} from './dtos/query-accommodation-request.dto';
import {
  UpdateAccommodationRequestDto,
  UpdateAccommodationRequestDtoType,
} from './dtos/update-accommodation-request.dto';
import { GetAccommodationByIdRequestQuery } from './queries/impl/get-accommodation-request-by-id.query';
import { GetDetailAccommodationRequest } from './queries/impl/get-detail-accommodation-request';
import { GetPaginateAccommodationRequest } from './queries/impl/get-paginate-accommodation-request';

@Controller('accommodation-request')
export class AccommodationRequestController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Write)
  @Post()
  async created(
    @Valibot({ schema: CreateAccommodationRequestDto })
    input: CreateAccommodationRequestDtoType,
  ) {
    const result =
      await this._commandBus.execute<CreateAccommodationRequestCommand>(
        new CreateAccommodationRequestCommand(input),
      );

    return { message: result };
  }

  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryAccommodationRequestDto, type: 'query' })
    query: QueryAccommodationRequestDtoType,
  ) {
    return await this._queryBus.execute<GetPaginateAccommodationRequest>(
      new GetPaginateAccommodationRequest(query),
    );
  }

  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Read)
  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetAccommodationByIdRequestQuery>(
      new GetAccommodationByIdRequestQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Read)
  @Get(':id/detail')
  async getDetail(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryAccommodationRequestByIdDto, type: 'query' })
    query: QueryAccommodationRequestByIdDtoType,
  ) {
    return await this._queryBus.execute<GetDetailAccommodationRequest>(
      new GetDetailAccommodationRequest(params.id, query),
    );
  }

  @Permissions(PermissionGroup.AccommodationRequest, PermissionName.Write)
  @Put(':id')
  async updated(
    @Valibot({ schema: UpdateAccommodationRequestDto })
    input: UpdateAccommodationRequestDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdatedAccommodationCommand>(
      new UpdatedAccommodationCommand(params.id, input),
    );
    return { message: result };
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
