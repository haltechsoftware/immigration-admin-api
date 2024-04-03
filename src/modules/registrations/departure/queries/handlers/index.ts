import { DepartureRegisterHandler } from './departure.repository';
import { GetDepartureByIdHandler } from './get-departure-by-id.repository';
import { DepartureVerifyCodeHandler } from './verify-code-departure.repository';

const departureRegisterHandlers = [
  DepartureRegisterHandler,
  GetDepartureByIdHandler,
  DepartureVerifyCodeHandler,
];

export default departureRegisterHandlers;
