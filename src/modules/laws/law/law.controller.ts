import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FormDataRequest } from 'nestjs-form-data';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  OffsetBasePaginateDto,
  OffsetBasePaginateDtoType,
} from 'src/common/dtos/offset-base-paginate.dto';
import { PermissionGroup } from 'src/common/enum/permission.enum';
import { PermissionName } from './../../../common/enum/permission.enum';
import CreateLawCommand from './command/impl/create-law.command';
import RemoveLawCommand from './command/impl/delete-law.command';
import UpdateLawCommand from './command/impl/update-law.command';
import { CreateLawDto, CreateLawDtoType } from './dto/create-law.dto';
import { UpdateLawDto, UpdateLawDtoType } from './dto/update-law.dto';
import GetLawByIdQuery from './queries/impl/get-law-by-id.query';
import GetLawQuery from './queries/impl/get-law.query';
import { Public } from 'src/common/decorators/public.decorator';
import GetLawClientQuery from './queries/impl/get-law-client.query';

@Controller('law')
export class LawController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Public()
  @Get('client')
  async getToClient() {
    return await this.queryBus.execute<GetLawClientQuery>(new GetLawClientQuery());
  }

  @Permissions(PermissionGroup.Law, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    query: OffsetBasePaginateDtoType,
  ) {
    return await this.queryBus.execute<GetLawQuery>(new GetLawQuery(query));
  }

  @Permissions(PermissionGroup.Law, PermissionName.Write)
  @FormDataRequest()
  @Post()
  async create(@Valibot({ schema: CreateLawDto }) body: CreateLawDtoType) {
    const res = await this.commandBus.execute<CreateLawCommand>(
      new CreateLawCommand(body),
    );
    return { message: res };
  }

  @Permissions(PermissionGroup.Law, PermissionName.Read)
  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GetLawByIdQuery>(
      new GetLawByIdQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.Law, PermissionName.Remove)
  @Delete(':id')
  async delete(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const res = await this.commandBus.execute<RemoveLawCommand>(
      new RemoveLawCommand(params.id),
    );
    return { message: res };
  }

  @Permissions(PermissionGroup.Law, PermissionName.Write)
  @FormDataRequest()
  @Put(':id')
  async update(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
    @Valibot({ schema: UpdateLawDto }) body: UpdateLawDtoType,
  ) {
    const res = await this.commandBus.execute<UpdateLawCommand>(
      new UpdateLawCommand(params.id, body),
    );
    return { message: res };
  }
}
