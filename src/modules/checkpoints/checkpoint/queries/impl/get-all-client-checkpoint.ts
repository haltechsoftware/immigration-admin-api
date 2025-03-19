import { QueryClientCheckpointDtoType } from '../../dtos/query-client-checkinpoint.dto';

export class GetAllClientCheckpointCommand {
  constructor(public readonly query: QueryClientCheckpointDtoType) {}
}
