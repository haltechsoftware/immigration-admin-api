import { GetByIdClientDtoType } from '../../dtos/query-by-id-client';

export class GetOneClientCheckpointCommand {
  constructor(
    public readonly params: string,
    public readonly query: GetByIdClientDtoType,
  ) {}
}
