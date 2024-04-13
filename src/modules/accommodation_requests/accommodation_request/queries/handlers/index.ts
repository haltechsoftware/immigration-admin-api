import { Provider } from '@nestjs/common';
import { GetAccommodationByIdHandler } from './get-accommodation-request-by-id.repository';
import { DetailAccommodationRequestHandler } from './get-detail-accommodation-request.repository';
import { GetPaginateAccommodationRequestHandler } from './get-paginate-accommodation-request.repository';

export const accommodationRequestQuery: Provider[] = [
  GetPaginateAccommodationRequestHandler,
  DetailAccommodationRequestHandler,
  GetAccommodationByIdHandler,
];
