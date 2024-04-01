import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { FileAndDirectory } from "src/modules/files_and_directories/entities";

export class GetAllFilesAndDirectoryQuery {
    
    constructor(
        public readonly input: IOffsetBasePaginate<FileAndDirectory>
    ){}
}