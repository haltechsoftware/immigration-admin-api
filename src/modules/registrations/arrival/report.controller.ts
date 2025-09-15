import { Controller, Get, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Valibot } from 'src/common/decorators/valibot/valibot.decorator';
import {
  PermissionGroup,
  PermissionName,
} from 'src/common/enum/permission.enum';
import ReportArrivalRegisterQuery from './queries/impl/report.query';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Response } from 'express';
import {
  QueryReportArrivalDtoType,
  queryReportArrivalDto,
} from './dto/query-report-arrival.dto';

@Controller('report')
export class ReportArrivalRegistrationController {
  constructor(private readonly queryBus: QueryBus) {}

  /** Report Arrival Registration */
  @Permissions(PermissionGroup.Registration, PermissionName.Read)
  @Get('arrival')
  async reportArrivalRegister(
    @Valibot({ schema: queryReportArrivalDto, type: 'query' })
    query: QueryReportArrivalDtoType,
    @Res() res: Response,
  ) {
    return await this.queryBus.execute<ReportArrivalRegisterQuery>(
      new ReportArrivalRegisterQuery(query, res),
    );
  }
}
