import { Provider } from "@nestjs/common";
import { GetAllFilesAndDirectorydHandler } from "./get-all-repository";
import { GetListFileByIdHandler } from "./get-list-file-by-id";

export const queryFileAndDirectory : Provider[] = [
    GetAllFilesAndDirectorydHandler,
    GetListFileByIdHandler,
]