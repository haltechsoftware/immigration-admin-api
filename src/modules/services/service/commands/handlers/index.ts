import { Provider } from '@nestjs/common';
import { CreateServiceHandler } from './create-service.handler';
import { RemoveServiceHandler } from './remove-service.handler';
import { UpdateServiceHandler } from './update-service.handler';

export const serviceHandlers: Provider[] = [
  CreateServiceHandler,
  UpdateServiceHandler,
  RemoveServiceHandler,
];
