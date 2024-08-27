import { Module } from '@nestjs/common';
import { serviceHandlers } from './commands/handlers';
import { serviceQuery } from './queries/handlers';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './service.repository';

@Module({
  controllers: [ServiceController],
  providers: [ServiceRepository, ...serviceHandlers, ...serviceQuery],
})
export class ServiceModule {}
