import { QueryVisaCategoryType } from '../../dto/query-visa-category.dto';

export default class GetVisaCategoryQuery {
  constructor(public readonly paginate: QueryVisaCategoryType) {}
}
