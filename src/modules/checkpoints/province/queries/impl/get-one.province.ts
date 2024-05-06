import { QueryAccommodationRequestByIdDtoType } from "src/modules/accommodation_requests/accommodation_request/dtos/query-accommodation-request-by-id.dto";

export class GetOneProvinceCommand {
    constructor(
        public readonly id: number,
        public readonly query: QueryAccommodationRequestByIdDtoType,
    ){}
}