import { QueryLostPassportByIdDtoType } from '../../dtos/query-lost-passport-by-id.dto';

export class GetDetailLostPassportQuery {
  constructor(
    public readonly id: number,
    public readonly query: QueryLostPassportByIdDtoType,
  ) {}
}
