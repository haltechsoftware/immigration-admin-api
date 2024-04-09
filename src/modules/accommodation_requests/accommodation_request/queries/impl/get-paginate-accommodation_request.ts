import { IOffsetBasePaginate } from 'src/common/interface/pagination/pagination.interface';
import { AccommodationRequest } from 'src/modules/accommodation_requests/entities';

export class GetPaginateAccommodationRequest {
  constructor(
    public readonly paginate: IOffsetBasePaginate<AccommodationRequest>,
  ) {}
}
