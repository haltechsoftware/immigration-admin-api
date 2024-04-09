import { Provider } from '@nestjs/common';
import { DetailAccommodationRequestHandler } from './get-detail-accommodation-request.repository';
import { GetPaginateAccommodationRequestHandler } from './get-paginate-accommodation-request.repository';

export const accommodationRequestQuery: Provider[] = [
  GetPaginateAccommodationRequestHandler,
  DetailAccommodationRequestHandler,
];
