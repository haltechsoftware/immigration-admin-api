import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { CreateServiceCommand } from './commands/impl/create-service.command';
import { RemoveServiceCommand } from './commands/impl/remove-service.command';
import { UpdatedServiceCommand } from './commands/impl/update-service.command';
import {
  CreateServiceDto,
  CreateServiceDtoType,
} from './dtos/create-service.dto';
import {
  QueryServiceByIdDto,
  QueryServiceByIdDtoType,
} from './dtos/query-service-by-id.dto';
import { QueryServiceDto, QueryServiceDtoType } from './dtos/query-service.dto';
import {
  UpdateServiceDto,
  UpdateServiceDtoType,
} from './dtos/update-service.dto';
import { GetDetailServiceQuery } from './queries/impl/get-detail-service';
import { GetPaginateServiceQuery } from './queries/impl/get-paginate-service';
import { GetServiceByIdQuery } from './queries/impl/get-service-by-id.query';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllToClientServiceQuery } from './queries/impl/get-all-to-client-service';

@Controller('services')
export class ServiceController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @Permissions(PermissionGroup.Service, PermissionName.Write)
  @Post()
  async created(
    @Valibot({ schema: CreateServiceDto })
    input: CreateServiceDtoType,
  ) {
    const result = await this._commandBus.execute<CreateServiceCommand>(
      new CreateServiceCommand(input),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.Service, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryServiceDto, type: 'query' })
    query: QueryServiceDtoType,
  ) {
    return await this._queryBus.execute<GetPaginateServiceQuery>(
      new GetPaginateServiceQuery(query),
    );
  }

  @Public()
  @Get('client')
  async getToClient(
    @Valibot({ schema: QueryServiceDto, type: 'query' })
    query: QueryServiceDtoType,
  ) {
    return await this._queryBus.execute<GetAllToClientServiceQuery>(
      new GetAllToClientServiceQuery(query),
    );
  }


  @Public()
  @Get('client/:id')
  async getByIdClient(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryServiceByIdDto, type: 'query' })
    query: QueryServiceByIdDtoType,
  ) {
    return await this._queryBus.execute<GetDetailServiceQuery>(
      new GetDetailServiceQuery(params.id, query),
    );
  }

  @Permissions(PermissionGroup.Service, PermissionName.Read)
  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetServiceByIdQuery>(
      new GetServiceByIdQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.Service, PermissionName.Read)
  @Get(':id/detail')
  async getDetail(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryServiceByIdDto, type: 'query' })
    query: QueryServiceByIdDtoType,
  ) {
    return await this._queryBus.execute<GetDetailServiceQuery>(
      new GetDetailServiceQuery(params.id, query),
    );
  }

  @Permissions(PermissionGroup.Service, PermissionName.Write)
  @Put(':id')
  async updated(
    @Valibot({ schema: UpdateServiceDto })
    input: UpdateServiceDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdatedServiceCommand>(
      new UpdatedServiceCommand(params.id, input),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Service, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<RemoveServiceCommand>(
      new RemoveServiceCommand(params.id),
    );
    return { message: result };
  }
}
