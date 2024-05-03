import { GuestsCheckInDtoType } from '../../dtos/guests-check-in.dto';

export class GuestCheckInCommand {
  constructor(
    public readonly hotelId: number,
    public readonly data: GuestsCheckInDtoType,
  ) {}
}
