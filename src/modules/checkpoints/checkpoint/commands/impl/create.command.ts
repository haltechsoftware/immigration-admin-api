import { CreateCheckpointDtoType } from "../../dtos/create-checkpoint.dto";



export class CreateCheckPointCommand {
    constructor(
        public readonly input: CreateCheckpointDtoType
    ){}
}