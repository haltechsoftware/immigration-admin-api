import { Module } from '@nestjs/common';
import { AdminHotelController } from './admin-hotel.controller';
import { AdminHotelRepository } from './admin-hotel.repository';
import adminHotelCommandHandlers from './commands/handlers';
import adminHotelQueryHandlers from './queries/handlers';

@Module({
  providers: [
    ...adminHotelCommandHandlers,
    ...adminHotelQueryHandlers,
    AdminHotelRepository,
  ],
  controllers: [AdminHotelController],
})
export class AdminHotelModule {}
