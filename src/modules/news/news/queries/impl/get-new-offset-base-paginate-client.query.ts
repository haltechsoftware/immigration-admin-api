import { QueryClientNewsDtoType } from '../../dtos/query-news-client.dto';


export class GetNewsOffsetBasePaginateClientQuery {
  constructor(public readonly paginate: QueryClientNewsDtoType) {}
}