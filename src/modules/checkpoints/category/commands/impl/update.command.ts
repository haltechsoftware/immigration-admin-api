import { UpdateCheckpointCategoryDtoType } from "../../dtos/update-country.dto";


export class UpdateCheckpointCategoryCommand {
    constructor(
        public readonly id: number,
        public readonly input: UpdateCheckpointCategoryDtoType,
    ){}
}