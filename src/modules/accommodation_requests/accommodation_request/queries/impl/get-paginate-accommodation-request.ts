import { QueryAccommodationRequestDtoType } from '../../dtos/query-accommodation-request.dto';

export class GetPaginateAccommodationRequest {
  constructor(public readonly paginate: QueryAccommodationRequestDtoType) {}
}
