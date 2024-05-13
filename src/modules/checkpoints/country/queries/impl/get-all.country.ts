import { QueryCountryDtoType } from '../../dtos/query.country.dto';

export class GetAllCountryCommand {
  constructor(public readonly query: QueryCountryDtoType) {}
}
