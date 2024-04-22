import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { News } from "src/modules/news/entities";

export class GetNewsOffsetBasePaginateQuery {
    constructor(
        public readonly paginate: IOffsetBasePaginate<News>
    ){}
}