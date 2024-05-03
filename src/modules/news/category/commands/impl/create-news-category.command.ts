import { CreateNewsCategorytDtoType } from "../../dtos/create-news-category.dto";

export class CreateNewsCategoryCommand{
    constructor(
        public readonly input: CreateNewsCategorytDtoType,

    ){}
}