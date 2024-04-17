import { QueryVisaCategoryDetailDtoType } from '../../dto/query-visa-category-detail.dto';

export class GetVisaCategoryDetailQuery {
  constructor(
    public readonly id: number,
    public readonly query: QueryVisaCategoryDetailDtoType,
  ) {}
}
