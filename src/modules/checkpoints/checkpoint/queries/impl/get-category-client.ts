import { QueryCategoryClientDtoType } from "../../dtos/query-category-client.dto";

export class GetAllCategoryClientCommand {
    constructor(public readonly query: QueryCategoryClientDtoType) {}
}
