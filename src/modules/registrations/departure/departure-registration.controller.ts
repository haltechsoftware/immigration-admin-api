import { Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import ScanDepartureCodeCommand from './commands/impl/scan-departure-code.command';
import VerifyDepartureCodeCommand from './commands/impl/verify-departure-code.command';
import {
  QueryDepartureDto,
  QueryDepartureDtoType,
} from './dto/query-departure.dto';
import {
  VerifyDepartureCodeDto,
  VerifyDepartureCodeDtoType,
} from './dto/verify-departure-code.dto';
import DepartureRegisterQuery from './queries/impl/departure.query';
import GetDepartureByIdQuery from './queries/impl/get-departure-by-id.query';
import { Public } from 'src/common/decorators/public.decorator';
import {
  DepartureRegistrationDto,
  DepartureRegistrationDtoType,
} from './dto/departure-registration.dto';
import DepartureRegistrationCommand from './commands/impl/departure-registration.command';
import { Auth } from 'src/common/decorators/auth.decorator';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { Throttle } from '@nestjs/throttler';

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

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Public()
  @Post()
  async createDeparture(
    @Valibot({ schema: DepartureRegistrationDto })
    input: DepartureRegistrationDtoType,
  ): Promise<any> {
    return await this.commandBus.execute<DepartureRegistrationCommand>(
      new DepartureRegistrationCommand(input),
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
  @HttpCode(200)
  @Post('scan')
  async scanQR(
    @Valibot({ schema: VerifyDepartureCodeDto })
    body: VerifyDepartureCodeDtoType,
  ) {
    return await this.commandBus.execute<ScanDepartureCodeCommand>(
      new ScanDepartureCodeCommand(body),
    );
  }

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Permissions(PermissionGroup.Registration, PermissionName.Write)
  @Put(':id')
  async verifyCode(
    @Valibot({ schema: GetByIdDto, type: 'params' }) { id }: GetByIdDtoType,
    @Auth() user: IJwtPayload,
  ): Promise<any> {
    const user_id = Number(user.sub);
    const message = await this.commandBus.execute<VerifyDepartureCodeCommand>(
      new VerifyDepartureCodeCommand(id, user_id),
    );

    return { message };
  }
}
