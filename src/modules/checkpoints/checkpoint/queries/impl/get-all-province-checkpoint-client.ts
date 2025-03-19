import { QueryCheckpointClientDtoType } from '../../dtos/query-client.dto';
import { QueryProvinceCheckpointClientDtoType } from '../../dtos/query-province-checkpoint.dto';

export class GetAllProvinceCheckpointCheckpointClientCommand {
  constructor(public readonly query: QueryProvinceCheckpointClientDtoType) {}
}
