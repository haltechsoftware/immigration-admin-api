import { Provider } from '@nestjs/common';
import { CreateAccommodationRequestHandler } from './create-accommodation_request.handler';
import { UpdatedAccommodationHandler } from './update-accommodation_request.handler';
import { DeletedAccommodationHandler } from './remove-accommodation_request.handler';

export const accommodationRequestHandlers: Provider[] = [
  CreateAccommodationRequestHandler,
  UpdatedAccommodationHandler,
  DeletedAccommodationHandler,
];
