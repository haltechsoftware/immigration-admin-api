import { GetByIdClientDtoType } from "src/modules/checkpoints/checkpoint/dtos/query-by-id-client";

export class GetOneClientNewsQuery {
  constructor(
    public readonly params: string,
    public readonly query: GetByIdClientDtoType,
  ) {}
}
