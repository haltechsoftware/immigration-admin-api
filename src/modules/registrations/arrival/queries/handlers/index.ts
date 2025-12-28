import { ArrivalRegisterHandler } from './arrival.repository';
import { checkCountryExceptVisaHandler } from './check-country-except-visa.repository';
import { GetArrivalByIdHandler } from './get-arrival-by-id.repository';
import { queryCountriesClientHandler } from './get-country.repository';
import { queryPointClientHandler } from './get-point-client.repository';
import { GetReportArrivalHandler } from './report-arrival-query.repository';
import { ReportArrivalRegisterHandler } from './report-arrival.repository';

const arrivalRegisterHandlers = [
  ArrivalRegisterHandler,
  GetArrivalByIdHandler,
  queryPointClientHandler,
  queryCountriesClientHandler,
  checkCountryExceptVisaHandler,
  ReportArrivalRegisterHandler,
  GetReportArrivalHandler,
];

export default arrivalRegisterHandlers;
