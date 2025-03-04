import { Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { CheckVerifyCodeCommand } from './commands/impl/check-verify-code.command';
import { GuestCheckInCommand } from './commands/impl/guests-check-in.command';
import {
  CheckVerifyCodeDto,
  CheckVerifyCodeDtoType,
} from './dtos/check-verify-code.dto';
import {
  GuestsCheckInDto,
  GuestsCheckInDtoType,
} from './dtos/guests-check-in.dto';
import {
  QueryGuestListDto,
  QueryGuestListDtoType,
} from './dtos/query-guest-list.dto';
import { GuestListQuery } from './queries/impl/guest-list.query';
import { GuestQuery } from './queries/impl/guest.query';

@Controller('admin-hotel')
export class AdminHotelController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async get(
    @Auth() auth: IJwtPayload,
    @Valibot({ schema: QueryGuestListDto, type: 'query' })
    query: QueryGuestListDtoType,
  ) {
    return await this.queryBus.execute<GuestListQuery>(
      new GuestListQuery(auth.hotel_id, query),
    );
  }

  @Get(':id')
  async getOne(
    @Valibot({ schema: GetByIdDto, type: 'params' })
    { id }: GetByIdDtoType,
  ) {
    return await this.queryBus.execute<GuestQuery>(new GuestQuery(id));
  }

  @Get(':code/verify-code')
  async checkVerifyCode(
    @Valibot({ schema: CheckVerifyCodeDto, type: 'params' })
    data: CheckVerifyCodeDtoType,
  ) {
    const res = await this.commandBus.execute<CheckVerifyCodeCommand>(
      new CheckVerifyCodeCommand(data),
    );

    return { message: res };
  }

  @Post()
  async guestsCheckIn(
    @Auth() auth: IJwtPayload,
    @Valibot({ schema: GuestsCheckInDto })
    data: GuestsCheckInDtoType,
  ) {
    const res = await this.commandBus.execute<GuestCheckInCommand>(
      new GuestCheckInCommand(auth.hotel_id, data),
    );

    return { message: res };
  }
}
