import { Provider } from "@nestjs/common";
import { CreateDirectoryHander } from "./create-directory.handler";
import { DeleteFilesHandler } from "./delete-file.handler";
import { DeleteDirectoryHandler } from "./delete-directory";
import { CreateFileHander } from "./create.file.handler";

export const fileAndDirectoryHandlers: Provider[] = [
    CreateDirectoryHander,
    CreateFileHander,
    DeleteFilesHandler,
    DeleteDirectoryHandler
]