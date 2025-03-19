import { QueryClientNewsDtoType } from "../../dtos/query-news-client.dto";


export class GetNewsCategoryOffsetBasePaginateClientQuery {
  constructor(public readonly paginate: QueryClientNewsDtoType) {}
}