import { CreateNewsDtoType } from '../../dtos/create-news.dto';

export class CreateNewsCommand {
  constructor(public readonly input: CreateNewsDtoType) {}
}
