import { Controller, Delete, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  OffsetBasePaginateDto,
  OffsetBasePaginateDtoType,
} from 'src/common/dtos/offset-base-paginate.dto';
import {
  PermissionGroup,
  PermissionName,
} from '../../../common/enum/permission.enum';
import DeleteContactCommand from './command/impl/delete-contact.command';
import GetContactByIdQuery from './queries/impl/get-contact-by-id.query';
import GetContactQuery from './queries/impl/get-contact.query';
import { Public } from 'src/common/decorators/public.decorator';
import { SendContactDto, SendContactDtoType } from './dto/send-contact.dto';
import SendContactCommand from './command/impl/send-contact.command';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Contact, PermissionName.Read)
  @Get()
  async get(
    @Valibot({ schema: OffsetBasePaginateDto, type: 'query' })
    query: OffsetBasePaginateDtoType,
  ) {
    return await this.queryBus.execute<GetContactQuery>(
      new GetContactQuery(query),
    );
  }

  @Public()
  @Post()
  async sendContact(
    @Valibot({ schema: SendContactDto }) input: SendContactDtoType,
  ) {
    const res = await this.commandBus.execute<SendContactCommand>(
      new SendContactCommand(input),
    );

    return { message: res };
  }

  @Permissions(PermissionGroup.Contact, PermissionName.Read)
  @Get(':id')
  async getById(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    params: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GetContactByIdQuery>(
      new GetContactByIdQuery(params.id),
    );
  }

  @Permissions(PermissionGroup.Contact, PermissionName.Remove)
  @Delete(':id')
  async delete(
    @Valibot({ schema: GetByIdDto, type: 'params' }) params: GetByIdDtoType,
  ) {
    const res = await this.commandBus.execute<DeleteContactCommand>(
      new DeleteContactCommand(params.id),
    );

    return { message: res };
  }
}
