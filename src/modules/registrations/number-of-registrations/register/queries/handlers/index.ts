import { NumberRegisterEnterClientHandler } from './number-register-enter-client.handler';
import { NumberRegisterEnterHandler } from './number-register-enter.handler';
import { NumberRegisterExitHandler } from './number-register-exit.handler';

const NoOfRegisterQueryHandlers = [
  NumberRegisterEnterClientHandler,
  NumberRegisterEnterHandler,
  NumberRegisterExitHandler,
];

export default NoOfRegisterQueryHandlers;
