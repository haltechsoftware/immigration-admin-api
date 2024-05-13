import { CreateCreateCheckpointCategoryDtoType } from '../../dtos/create.dto';

export class CreateCheckPointCategoryCommand {
  constructor(public readonly input: CreateCreateCheckpointCategoryDtoType) {}
}
