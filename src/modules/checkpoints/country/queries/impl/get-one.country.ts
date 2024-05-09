import { QueryAccommodationRequestByIdDtoType } from "src/modules/accommodation_requests/accommodation_request/dtos/query-accommodation-request-by-id.dto";
import { QueryCountryByIdDtoType } from "../../dtos/query-country-by-id.dto";

export class GetOneCountryCommand {
    constructor(
        public readonly id: number,
        public readonly query: QueryCountryByIdDtoType,
    ){}
}