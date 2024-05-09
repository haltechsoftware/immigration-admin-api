import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { QueryProvinceDtoType } from "../../dtos/query.province.dto";
import { Provinces } from "src/modules/checkpoints/entities";

export class GetAllProvinceCommand {
    constructor(
        public readonly query: QueryProvinceDtoType,
        public readonly paginated: IOffsetBasePaginate<Provinces>,
    ){}
}