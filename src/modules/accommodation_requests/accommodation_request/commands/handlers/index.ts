import { Provider } from '@nestjs/common';
import { CreateAccommodationRequestHandler } from './create-accommodation-request.handler';
import { DeletedAccommodationHandler } from './remove-accommodation-request.handler';
import { UpdatedAccommodationHandler } from './update-accommodation-request.handler';

export const accommodationRequestHandlers: Provider[] = [
  CreateAccommodationRequestHandler,
  UpdatedAccommodationHandler,
  DeletedAccommodationHandler,
];
