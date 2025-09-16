import { Response } from 'express';
import { QueryReportArrivalDtoType } from '../../dto/query-report-arrival.dto';

export default class ReportArrivalRegisterQuery {
  constructor(
    public readonly query: QueryReportArrivalDtoType,
    public readonly res: Response,
  ) {}
}
