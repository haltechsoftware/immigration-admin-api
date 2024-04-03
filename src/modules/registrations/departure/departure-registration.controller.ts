import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import DepartureRegisterQuery from './queries/impl/departure.query';
import GetDepartureByIdQuery from './queries/impl/get-departure-by-id.query';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import {
  QueryDepartureDto,
  QueryDepartureDtoType,
} from './dto/query-departure.dto';
import DepartureVerifyCodeQuery from './queries/impl/verify-code-departure.query';

@Controller('departure')
export class DepartureRegistrationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Public()
  @Get()
  async departureRegister(
    @Valibot({ schema: QueryDepartureDto, type: 'query' })
    query: QueryDepartureDtoType,
  ): Promise<any> {
    return await this.queryBus.execute<DepartureRegisterQuery>(
      new DepartureRegisterQuery(query),
    );
  }

  @Public()
  @Get(':id')
  async GetDepartureByIdHandler(@Param('id') id: number): Promise<any> {
    return await this.queryBus.execute<GetDepartureByIdQuery>(
      new GetDepartureByIdQuery(id),
    );
  }

  @Public()
  @Get('get/:verification_code')
  async verify_code(
    @Param('verification_code') verification_code: string,
  ): Promise<any> {
    return await this.queryBus.execute<DepartureVerifyCodeQuery>(
      new DepartureVerifyCodeQuery(verification_code),
    );
  }
}
