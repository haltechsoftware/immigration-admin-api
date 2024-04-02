import CreateHotelHandler from "./create-hotel.handler";
import RemoveHotelHandler from "./remove-hotel.handler";
import UpdatePrivatePopupHandler from "./update-hotel-status.handler";
import { UpdateHotelHandler } from "./update-hotel.handler";

const hotelCommandHandlers = [
    CreateHotelHandler,
    UpdateHotelHandler,
    UpdatePrivatePopupHandler,
    RemoveHotelHandler
];
  
export default hotelCommandHandlers;