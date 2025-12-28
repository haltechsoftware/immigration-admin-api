import { Controller, Get, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Response } from 'express';
import {
  QueryReportDepartureDto,
  QueryReportDepartureDtoType,
} from './dto/query-report-departure.dto';
import ReportDepartureRegisterQuery from './queries/impl/report-departure.command';
import GetReportDepartureQuery from './queries/impl/report-departure.query';

@Controller('report')
export class ReportArrivalRegistrationController {
  constructor(private readonly queryBus: QueryBus) {}

  /** Report Departure Registration */
  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get('departure')
  async reportDepartureRegister(
    @Valibot({ schema: QueryReportDepartureDto, type: 'query' })
    query: QueryReportDepartureDtoType,
    @Res() res: Response,
  ) {
    return await this.queryBus.execute<ReportDepartureRegisterQuery>(
      new ReportDepartureRegisterQuery(query, res),
    );
  }

  @Get('departure-tourism')
  async arrivalDeparture() {
    return await this.queryBus.execute<GetReportDepartureQuery>(
      new GetReportDepartureQuery(),
    );
  }
}
