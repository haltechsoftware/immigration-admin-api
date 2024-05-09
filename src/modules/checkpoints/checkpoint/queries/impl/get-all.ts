import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { QueryCheckpointDtoType } from "../../dtos/query.dto";
import { CheckPointType } from "src/modules/checkpoints/entities";

export class GetAllCheckpointCommand {
    constructor(
        public readonly query: QueryCheckpointDtoType,
        public readonly paginated: IOffsetBasePaginate<CheckPointType>,
    ){}
}