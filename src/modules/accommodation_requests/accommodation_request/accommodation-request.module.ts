import { Module } from '@nestjs/common';
import { AccommodationRequestController } from './accommodation-request.controller';
import { AccommodationRequestRepository } from './accommodation-request.repository';
import { accommodationRequestHandlers } from './commands/handlers';
import { accommodationRequestQuery } from './queries/handlers';

@Module({
  controllers: [AccommodationRequestController],
  providers: [
    AccommodationRequestRepository,
    ...accommodationRequestHandlers,
    ...accommodationRequestQuery,
  ],
})
export class AccommodationRequestModule {}
