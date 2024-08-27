import { QueryServiceByIdDtoType } from '../../../service/dtos/query-service-by-id.dto';

export class GetDetailServiceQuery {
  constructor(
    public readonly id: number,
    public readonly query: QueryServiceByIdDtoType,
  ) {}
}
