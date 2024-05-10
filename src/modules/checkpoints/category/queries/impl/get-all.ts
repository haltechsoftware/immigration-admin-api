import { QueryCheckpointCategoryDtoType } from '../../dtos/query.dto';

export class GetAllCheckpointCategoryCommand {
  constructor(public readonly query: QueryCheckpointCategoryDtoType) {}
}
