import { QueryLostPassportDtoType } from '../../dtos/query-lost-passport.dto';

export class GetPaginateLostPassportQuery {
  constructor(public readonly paginate: QueryLostPassportDtoType) {}
}
