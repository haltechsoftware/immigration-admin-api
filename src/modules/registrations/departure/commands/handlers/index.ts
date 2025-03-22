import { ScanDepartureCodeHandler } from './scan-departure-code.handler';
import { VerifyDepartureCodeHandler } from './verify-code-departure.repository';
import DepartureRegistrationHandler from './departure-registration.handler';

export const departureCommandHandlers = [
  VerifyDepartureCodeHandler,
  ScanDepartureCodeHandler,
  DepartureRegistrationHandler,
];
