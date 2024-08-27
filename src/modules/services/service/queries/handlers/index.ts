import { Provider } from '@nestjs/common';
import { GetDetailServiceHandler } from './get-detail-service.repository';
import { GetPaginateServiceHandler } from './get-paginate-service.repository';
import { GetServiceByIdHandler } from './get-service-by-id.repository';

export const serviceQuery: Provider[] = [
  GetDetailServiceHandler,
  GetPaginateServiceHandler,
  GetServiceByIdHandler,
];
