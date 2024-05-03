import { UpdateNewsCategoryDtoType } from '../../dtos/update-news-category.dto';

export class UpdateNewsCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly input: UpdateNewsCategoryDtoType,
  ) {}
}
