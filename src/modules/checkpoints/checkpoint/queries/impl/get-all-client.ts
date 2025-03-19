import { QueryCheckpointClientDtoType } from '../../dtos/query-client.dto';

export class GetAllCheckpointClientCommand {
  constructor(public readonly query: QueryCheckpointClientDtoType) {}
}
