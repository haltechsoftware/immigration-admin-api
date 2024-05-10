import { QueryProvinceDtoType } from '../../dtos/query.province.dto';

export class GetAllProvinceCommand {
  constructor(public readonly query: QueryProvinceDtoType) {}
}
