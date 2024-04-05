import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  QueryDepartureDto,
  QueryDepartureDtoType,
} from './dto/query-departure.dto';
import DepartureRegisterQuery from './queries/impl/departure.query';
import GetDepartureByIdQuery from './queries/impl/get-departure-by-id.query';
import {
  VerifyDepartureCodeDto,
  VerifyDepartureCodeDtoType,
} from './dto/verify-departure-code.dto';
import VerifyDepartureCodeCommand from './commands/impl/verify-departure-code.command';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';

@Controller('departure')
export class DepartureRegistrationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get()
  async departureRegister(
    @Valibot({ schema: QueryDepartureDto, type: 'query' })
    query: QueryDepartureDtoType,
  ): Promise<any> {
    return await this.queryBus.execute<DepartureRegisterQuery>(
      new DepartureRegisterQuery(query),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get(':id')
  async GetDepartureByIdHandler(
    @Valibot({ schema: GetByIdDto, type: 'params' }) { id }: GetByIdDtoType,
  ): Promise<any> {
    return await this.queryBus.execute<GetDepartureByIdQuery>(
      new GetDepartureByIdQuery(id),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post()
  async verifyCode(
    @Valibot({ schema: VerifyDepartureCodeDto })
    body: VerifyDepartureCodeDtoType,
  ): Promise<any> {
    const result = await this.commandBus.execute<VerifyDepartureCodeCommand>(
      new VerifyDepartureCodeCommand(body),
    );

    return { message: result };
  }
}
