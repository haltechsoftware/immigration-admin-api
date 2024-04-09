import { Module } from '@nestjs/common';
import { AccommodationRequestController } from './accommodation_request.controller';
import { accommodationRequestHandlers } from './commands/handlers';
import { AccommodationRequestRepository } from './accommodation_request.repository';
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
