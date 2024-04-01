import { CreateDirectoryDtoType } from "../../dtos/create-directory.dto";

export class CreateDirectoryCommand {
    constructor(
        public readonly input : CreateDirectoryDtoType
    ){}
}