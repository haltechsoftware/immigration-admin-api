import { QueryCheckpointByIdDtoType } from "../../dtos/query-by-id.dto";

export class GetOneCheckpointCommand {
    constructor(
        public readonly id: number,
        public readonly query: QueryCheckpointByIdDtoType,
    ){}
}