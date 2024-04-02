import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import hotelCommandHandlers from './commands/handlers';
import hotelQueryHandlers from './queries/handlers';
import { HotelRepository } from './hotel.repository';

@Module({
    providers: [...hotelCommandHandlers, ...hotelQueryHandlers, HotelRepository],
    controllers: [HotelController],
})
export class HotelModule {}
