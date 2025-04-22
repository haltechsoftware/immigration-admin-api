import { ArrivalRegisterHandler } from './arrival.repository';
import { GetArrivalByIdHandler } from './get-arrival-by-id.repository';
import { queryCountriesClientHandler } from './get-country.repository';
import { queryPointClientHandler } from './get-point-client.repository';

const arrivalRegisterHandlers = [
  ArrivalRegisterHandler,
  GetArrivalByIdHandler,
  queryPointClientHandler,
  queryCountriesClientHandler,
];

export default arrivalRegisterHandlers;
