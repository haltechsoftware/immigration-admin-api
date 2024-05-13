import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { CreateCountryCommand } from './commands/impl/create-country.command';
import { DeleteCountryCommand } from './commands/impl/delete-country.command';
import { UpdateCountryCommand } from './commands/impl/update-country.command';
import {
  CreateCountryDto,
  CreateCountryDtoType,
} from './dtos/create-country.dto';

import { QueryCountryDto, QueryCountryDtoType } from './dtos/query.country.dto';
import {
  UpdateCountryDto,
  UpdateCountryDtoType,
} from './dtos/update-country.dto';
import { GetAllCountryCommand } from './queries/impl/get-all.country';
import { GetOneCountryCommand } from './queries/impl/get-one.country';

@Controller('country')
export class CountryController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) {}

  @FormDataRequest()
  @Permissions(PermissionGroup.Country, PermissionName.Write)
  @Post()
  async create(
    @Valibot({ schema: CreateCountryDto }) input: CreateCountryDtoType,
  ) {
    const message = await this._commandBus.execute<CreateCountryCommand>(
      new CreateCountryCommand(input),
    );

    return { message };
  }

  @Permissions(PermissionGroup.Country, PermissionName.Write)
  @FormDataRequest()
  @Put(':id')
  async update(
    @Valibot({ schema: UpdateCountryDto }) input: UpdateCountryDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const message = await this._commandBus.execute<UpdateCountryCommand>(
      new UpdateCountryCommand(params.id, input),
    );
    return { message };
  }

  @Permissions(PermissionGroup.Country, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryCountryDto, type: 'query' })
    query: QueryCountryDtoType,
  ) {
    return await this._queryBus.execute<GetAllCountryCommand>(
      new GetAllCountryCommand(query),
    );
  }

  @Permissions(PermissionGroup.Country, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneCountryCommand>(
      new GetOneCountryCommand(params.id),
    );
  }

  @Permissions(PermissionGroup.Country, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const message = await this._commandBus.execute<DeleteCountryCommand>(
      new DeleteCountryCommand(params.id),
    );
    return { message };
  }
}
