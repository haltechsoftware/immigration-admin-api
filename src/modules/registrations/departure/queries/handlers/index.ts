import { DepartureRegisterHandler } from './departure.repository';
import { GetDepartureByIdHandler } from './get-departure-by-id.repository';
import { GetReportDepartureHandler } from './report-departure.repository';
import { ReportDepartureRegisterHandler } from './report.resitory';

const departureRegisterHandlers = [
  DepartureRegisterHandler,
  GetDepartureByIdHandler,
  ReportDepartureRegisterHandler,
  GetReportDepartureHandler,
];

export default departureRegisterHandlers;
