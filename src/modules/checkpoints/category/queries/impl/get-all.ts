import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { QueryCheckpointCategoryDtoType } from "../../dtos/query.dto";
import { CheckpointCategory } from "src/modules/checkpoints/entities";

export class GetAllCheckpointCategoryCommand {
    constructor(
        public readonly query: QueryCheckpointCategoryDtoType,
        public readonly paginated: IOffsetBasePaginate<CheckpointCategory>,

    ){}
}