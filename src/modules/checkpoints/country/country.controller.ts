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
import { ValibotAsync } from 'src/common/decorators/valibot/valibot-async.decorator';
import { MergeDrizzleToReqInterceptor } from 'src/common/interceptor/merge-drizzle-to-req/merge-drizzle-to-req.interceptor';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import { CreateCountryDto, CreateCountryDtoType } from './dtos/create-country.dto';
import { CreateCountryCommand } from './commands/impl/create-country.command';
import { FormDataRequest } from 'nestjs-form-data';
import { UpdateCountryDto, UpdateCountryDtoType } from './dtos/update-country.dto';
import { UpdateCountryCommand } from './commands/impl/update-country.command';
import { DeleteCountryCommand } from './commands/impl/delete-country.command';
import { QueryCountryDto, QueryCountryDtoType } from './dtos/query.country.dto';
import { GetAllCountryCommand } from './queries/impl/get-all.country';
import { QueryProvinceByIdDto } from '../province/dtos/query-province-by-id.dto';
import { QueryCountryByIdDto, QueryCountryByIdDtoType } from './dtos/query-country-by-id.dto';
import { GetOneCountryCommand } from './queries/impl/get-one.country';
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from 'src/common/dtos/offset-base-paginate.dto';

@Controller('country')
export class CountryController {
  constructor(private _commandBus: CommandBus, private _queryBus: QueryBus) { }

  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @FormDataRequest()
  @Permissions(PermissionGroup.Country, PermissionName.Write)
  @Post()
  async create(
    @ValibotAsync({ schema: CreateCountryDto }) input: CreateCountryDtoType,
  ) {
    const result = await this._commandBus.execute<CreateCountryCommand>(
      new CreateCountryCommand(input),
    );

    return { message: result };
  }

  @Permissions(PermissionGroup.Country, PermissionName.Write)
  @FormDataRequest()
  @UseInterceptors(MergeDrizzleToReqInterceptor)
  @Put(':id')
  async update(
    @ValibotAsync({ schema: UpdateCountryDto }) input: UpdateCountryDtoType,
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<UpdateCountryCommand>(
      new UpdateCountryCommand(params.id, input),
    );
    return { message: result };
  }

  @Permissions(PermissionGroup.Country, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: QueryCountryDto, type: 'query' })
    query: QueryCountryDtoType,
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    paginate: OffsetBasePaginateDtoType,
  ) {
    return await this._queryBus.execute<GetAllCountryCommand>(
      new GetAllCountryCommand(query, paginate),
    );
  }

  @Permissions(PermissionGroup.Country, PermissionName.Read)
  @Get(':id')
  async findOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
    @Valibot({ schema: QueryCountryByIdDto, type: 'query' })
    query: QueryCountryByIdDtoType,
  ) {
    return await this._queryBus.execute<GetOneCountryCommand>(
      new GetOneCountryCommand(params.id, query),
    );
  }

  @Permissions(PermissionGroup.Country, PermissionName.Remove)
  @Delete(':id')
  async remove(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    const result = await this._commandBus.execute<DeleteCountryCommand>(
      new DeleteCountryCommand(params.id),
    );
    return { message: result };
  }
}
