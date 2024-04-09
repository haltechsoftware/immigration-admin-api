import { CreateFileDtoType } from "../../dtos/create-File.dto";

export class CreateFilesCommand {
    constructor(
        public readonly input : CreateFileDtoType
    ){}
}