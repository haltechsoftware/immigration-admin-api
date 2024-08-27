import { QueryServiceDtoType } from '../../../service/dtos/query-service.dto';

export class GetPaginateServiceQuery {
  constructor(public readonly paginate: QueryServiceDtoType) {}
}
