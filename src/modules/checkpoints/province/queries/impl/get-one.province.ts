import { QueryProvinceDtoType } from "../../dtos/query.province.dto";

export class GetOneProvinceCommand {
    constructor(
        public readonly id: number,
        public readonly query: QueryProvinceDtoType,
    ){}
}