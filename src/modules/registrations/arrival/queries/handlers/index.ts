import { ArrivalRegisterHandler } from './arrival.repository';
import { GetArrivalByIdHandler } from './get-arrival-by-id.repository';
import { ArrivalVerifyCodeHandler } from './verify-code-arrival.repository';

const arrivalRegisterHandlers = [
  ArrivalRegisterHandler,
  GetArrivalByIdHandler,
  ArrivalVerifyCodeHandler,
];

export default arrivalRegisterHandlers;
