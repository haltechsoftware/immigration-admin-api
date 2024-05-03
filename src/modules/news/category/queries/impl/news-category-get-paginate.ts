import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { NewsCategories } from "src/modules/news/entities";

export class GetNewsCategoryOffsetBasePaginateQuery {
    constructor(
        public readonly paginate: IOffsetBasePaginate<NewsCategories>
    ){}
}