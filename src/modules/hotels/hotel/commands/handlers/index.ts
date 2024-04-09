import CreateHotelHandler from './create-hotel.handler';
import {
  default as PrivateHotelHandler,
  default as UpdatePrivatePopupHandler,
} from './private-hotel.handler';
import { PublicHotelHandler } from './public-hotel.handler';
import RemoveHotelHandler from './remove-hotel.handler';
import { UpdateHotelHandler } from './update-hotel.handler';

const hotelCommandHandlers = [
  CreateHotelHandler,
  UpdateHotelHandler,
  UpdatePrivatePopupHandler,
  RemoveHotelHandler,
  PublicHotelHandler,
  PrivateHotelHandler,
];

export default hotelCommandHandlers;
