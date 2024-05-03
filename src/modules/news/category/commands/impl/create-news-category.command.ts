import { CreateNewsCategoryDtoType } from '../../dtos/create-news-category.dto';

export class CreateNewsCategoryCommand {
  constructor(public readonly input: CreateNewsCategoryDtoType) {}
}
