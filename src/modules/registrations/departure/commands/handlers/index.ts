import { ScanDepartureCodeHandler } from './scan-departure-code.handler';
import { VerifyDepartureCodeHandler } from './verify-code-departure.repository';

export const departureCommandHandlers = [
  VerifyDepartureCodeHandler,
  ScanDepartureCodeHandler,
];
