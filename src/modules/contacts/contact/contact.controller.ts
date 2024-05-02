import { Controller, Delete, Get } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PermissionGroup, PermissionName } from '../../../common/enum/permission.enum';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from "src/common/decorators/valibot/valibot.decorator";
import GetContactQuery from "./queries/impl/get-contact.query";
import { OffsetBasePaginateDto, OffsetBasePaginateDtoType } from "src/common/dtos/offset-base-paginate.dto";
import { GetByIdDto, GetByIdDtoType } from "src/common/dtos/get-by-id.dto";
import GetContactByIdQuery from "./queries/impl/get-contact-by-id.query";
import DeleteContactCommand from "./command/impl/delete-contact.command";

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