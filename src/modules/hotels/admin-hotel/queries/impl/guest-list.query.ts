import { QueryGuestListDtoType } from '../../dtos/query-guest-list.dto';

export class GuestListQuery {
  constructor(
    public readonly hotelId: number,
    public readonly query: QueryGuestListDtoType,
  ) {}
}
