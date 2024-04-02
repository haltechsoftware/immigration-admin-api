import { QueryHotelType } from "../../dtos/query-hotel.dto";

export class GetAllHotelQuery {
  constructor(public readonly input: QueryHotelType) {}
}
