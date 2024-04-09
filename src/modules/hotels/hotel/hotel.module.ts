import { Module } from '@nestjs/common';
import hotelCommandHandlers from './commands/handlers';
import { HotelController } from './hotel.controller';
import { HotelRepository } from './hotel.repository';
import hotelQueryHandlers from './queries/handlers';

@Module({
  providers: [...hotelCommandHandlers, ...hotelQueryHandlers, HotelRepository],
  controllers: [HotelController],
})
export class HotelModule {}
