import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Public } from 'src/common/decorators/public.decorator';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import { GetByIdDto, GetByIdDtoType } from 'src/common/dtos/get-by-id.dto';
import {
  QueryDepartureDto,
  QueryDepartureDtoType,
} from './dto/query-departure.dto';
import DepartureRegisterQuery from './queries/impl/departure.query';
import GetDepartureByIdQuery from './queries/impl/get-departure-by-id.query';
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
  async GetDepartureByIdHandler(
    @Valibot({ schema: GetByIdDto, type: 'params' }) { id }: GetByIdDtoType,
  ): Promise<any> {
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
