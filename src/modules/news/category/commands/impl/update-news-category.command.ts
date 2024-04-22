import { UpdateNewsCategorytDtoType } from "../../dtos/update-news-cateory.dto";

export class UpdateNewsCategoryCommand{
    constructor(
        public readonly id: number,
        public readonly input: UpdateNewsCategorytDtoType,

    ){}
}