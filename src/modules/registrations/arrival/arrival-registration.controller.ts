import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import VerifyArrivalCodeCommand from './commands/impl/verify-arrival-code.command';
import { QueryArrivalDto, QueryArrivalDtoType } from './dto/query-arrival.dto';
import {
  VerifyArrivalCodeDto,
  VerifyArrivalCodeDtoType,
} from './dto/verify-arrival-code.dto';
import ArrivalRegisterQuery from './queries/impl/arrival.query';
import GetArrivalByIdQuery from './queries/impl/get-arrival-by-id.query';

@Controller('arrival')
export class ArrivalRegistrationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get()
  async arrivalRegister(
    @Valibot({ schema: QueryArrivalDto, type: 'query' })
    query: QueryArrivalDtoType,
  ) {
    return await this.queryBus.execute<ArrivalRegisterQuery>(
      new ArrivalRegisterQuery(query),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get(':id')
  async getArrivalById(
    @Valibot({ schema: GetByIdDto, type: 'params' }) { id }: GetByIdDtoType,
  ): Promise<any> {
    return await this.queryBus.execute<GetArrivalByIdQuery>(
      new GetArrivalByIdQuery(id),
    );
  }

  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Post()
  async verifyCode(
    @Valibot({ schema: VerifyArrivalCodeDto }) body: VerifyArrivalCodeDtoType,
  ): Promise<any> {
    const result = await this.commandBus.execute<VerifyArrivalCodeCommand>(
      new VerifyArrivalCodeCommand(body),
    );

    return { message: result };
  }
}
