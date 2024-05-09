import { DecrementRegisterEnterHandler } from './decrement-register-enter.handler';
import { DecrementRegisterExitHandler } from './decrement-register-exit.handler';
import { IncrementRegisterEnterHandler } from './increment-register-enter.handler';
import { IncrementRegisterExitHandler } from './increment-register-exit.handler';

const NoOfRegisterCommandHandlers = [
  IncrementRegisterExitHandler,
  IncrementRegisterEnterHandler,
  DecrementRegisterExitHandler,
  DecrementRegisterEnterHandler,
];

export default NoOfRegisterCommandHandlers;
