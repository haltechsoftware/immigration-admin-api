import { QueryAccommodationRequestByIdDtoType } from '../../dtos/query-accommodation-request-by-id.dto';

export class GetDetailAccommodationRequest {
  constructor(
    public readonly id: number,
    public readonly query: QueryAccommodationRequestByIdDtoType,
  ) {}
}
