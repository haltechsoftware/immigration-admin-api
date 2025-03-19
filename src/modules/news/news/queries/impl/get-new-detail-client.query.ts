import { GetByIdClientDtoType } from "src/modules/checkpoints/checkpoint/dtos/query-by-id-client";

export class GetOneClientNewsQuery {
  constructor(
    public readonly params: number,
    public readonly query: GetByIdClientDtoType,
  ) {}
}
