import { DepartureRegisterHandler } from './departure.repository';
import { GetDepartureByIdHandler } from './get-departure-by-id.repository';
import { ReportDepartureRegisterHandler } from './report.resitory';

const departureRegisterHandlers = [
  DepartureRegisterHandler,
  GetDepartureByIdHandler,
  ReportDepartureRegisterHandler,
];

export default departureRegisterHandlers;
