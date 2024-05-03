import { CreateVisaCategoryDtoType } from '../../dto/create.visa_category.dto';

export default class CreateVisaCategoryCommand {
  constructor(public readonly dto: CreateVisaCategoryDtoType) {}
}
