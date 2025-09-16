import { Response } from 'express';
import { QueryReportDepartureDtoType } from '../../dto/query-report-departure.dto';

export default class ReportDepartureRegisterQuery {
  constructor(
    public readonly query: QueryReportDepartureDtoType,
    public readonly res: Response,
  ) {}
}
