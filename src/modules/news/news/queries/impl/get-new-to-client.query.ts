import { QueryNewsClientDtoType } from "../../dtos/query-client.dto";

export class GetNewsClientOffsetBasePaginateQuery {
  constructor(public readonly paginate: QueryNewsClientDtoType) {}
}