import { Provider } from '@nestjs/common';
import { GetPaginateAccommodationRequestHandler } from './get-paginate-accommodation_request.repository';
import { DetailAccommodationRequestHandler } from './get-detail-accommodation_request.repostory';

export const accommodationRequestQuery: Provider[] = [
  GetPaginateAccommodationRequestHandler,
  DetailAccommodationRequestHandler,
];
