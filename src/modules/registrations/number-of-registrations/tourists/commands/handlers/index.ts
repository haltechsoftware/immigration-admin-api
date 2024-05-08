import { DecrementTouristEnterHandler } from './decrement-tourist-enter.handler';
import { DecrementTouristExitHandler } from './decrement-tourist-exit.handler';
import { IncrementTouristEnterHandler } from './increment-tourist-enter.handler';
import { IncrementTouristExitHandler } from './increment-tourist-exit.handler';

const NoOfTouristCommandHandlers = [
  IncrementTouristEnterHandler,
  DecrementTouristEnterHandler,
  IncrementTouristExitHandler,
  DecrementTouristExitHandler,
];

export default NoOfTouristCommandHandlers;
