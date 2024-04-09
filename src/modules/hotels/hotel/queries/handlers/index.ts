import { GetAllHotelQueryHandler } from './get-all-hotel.repository';
import { GetOneHotelQueryHandler } from './get-one-hotel.repository';

const hotelQueryHandlers = [GetAllHotelQueryHandler, GetOneHotelQueryHandler];

export default hotelQueryHandlers;
