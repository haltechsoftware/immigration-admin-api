import { QueryNewsDtoType } from '../../dtos/query-news.dto';

export class GetNewsOffsetBasePaginateQuery {
  constructor(public readonly paginate: QueryNewsDtoType) {}
}
