import { QueryCheckpointCategoryByIdDtoType } from "../../dtos/query-by-id.dto";

export class GetOneCheckpointCategoryCommand {
    constructor(
        public readonly id: number,
        public readonly query: QueryCheckpointCategoryByIdDtoType,
    ){}
}