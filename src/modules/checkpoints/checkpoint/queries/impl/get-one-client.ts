import { GetByIdClientDtoType } from '../../dtos/query-by-id-client';

export class GetOneClientCheckpointCommand {
  constructor(
    public readonly params: number,
    public readonly query: GetByIdClientDtoType,
  ) {}
}
