import { ArrivalRegisterHandler } from './arrival.repository';
import { GetArrivalByIdHandler } from './get-arrival-by-id.repository';

const arrivalRegisterHandlers = [
  ArrivalRegisterHandler,
  GetArrivalByIdHandler,
];

export default arrivalRegisterHandlers;
