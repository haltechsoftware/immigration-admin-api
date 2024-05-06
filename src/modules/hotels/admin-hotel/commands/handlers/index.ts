import { CheckVerifyCodeHandler } from './check-verify-code.handler';
import { GuestCheckInHandler } from './guests-check-in.handler';

const adminHotelCommandHandlers = [GuestCheckInHandler, CheckVerifyCodeHandler];

export default adminHotelCommandHandlers;
