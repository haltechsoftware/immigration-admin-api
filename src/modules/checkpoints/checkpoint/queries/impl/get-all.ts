import { QueryCheckpointDtoType } from '../../dtos/query.dto';

export class GetAllCheckpointCommand {
  constructor(public readonly query: QueryCheckpointDtoType) {}
}
