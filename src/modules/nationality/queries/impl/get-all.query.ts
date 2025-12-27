import { QueryNationalityType } from '../../dto/query.dto';

export default class GetNationalityQuery {
  constructor(public readonly paginate: QueryNationalityType) {}
}
