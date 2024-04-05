import { DepartureRegisterHandler } from './departure.repository';
import { GetDepartureByIdHandler } from './get-departure-by-id.repository';

const departureRegisterHandlers = [
  DepartureRegisterHandler,
  GetDepartureByIdHandler,
];

export default departureRegisterHandlers;
