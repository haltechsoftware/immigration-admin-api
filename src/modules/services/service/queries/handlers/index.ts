import { Provider } from '@nestjs/common';
import { GetDetailServiceHandler } from './get-detail-service.repository';
import { GetPaginateServiceHandler } from './get-paginate-service.repository';
import { GetServiceByIdHandler } from './get-service-by-id.repository';
import { GetAllToClientServiceHandler } from './get-all-client-service.repository';

export const serviceQuery: Provider[] = [
  GetAllToClientServiceHandler,
  GetPaginateServiceHandler,
  GetDetailServiceHandler,
  GetServiceByIdHandler,
];
