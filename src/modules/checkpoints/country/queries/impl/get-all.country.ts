import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { QueryCountryDtoType } from "../../dtos/query.country.dto";
import { Countries } from "src/modules/checkpoints/entities";

export class GetAllCountryCommand {
    constructor(
        public readonly query: QueryCountryDtoType,
        public readonly paginated: IOffsetBasePaginate<Countries>,
    ){}
}