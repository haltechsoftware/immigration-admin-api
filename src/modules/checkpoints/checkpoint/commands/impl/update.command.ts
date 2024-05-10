import { UpdateCheckpointDtoType } from "../../dtos/update-country.dto";

export class UpdateCheckpointCommand {
    constructor(
        public readonly id: number,
        public readonly input: UpdateCheckpointDtoType,
    ){}
}