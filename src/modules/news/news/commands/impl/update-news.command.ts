import { UpdateNewsDtoType } from "../../dtos/update-news.dto";

export class UpdateNewsCommand {
    constructor(
        public readonly id: number,
        public readonly input: UpdateNewsDtoType
    ){}
}