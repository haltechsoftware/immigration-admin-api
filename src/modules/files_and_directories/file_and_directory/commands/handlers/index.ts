import { Provider } from '@nestjs/common';
import { CreateDirectoryHandler } from './create-directory.handler';
import { CreateFileHandler } from './create.file.handler';
import { DeleteDirectoryHandler } from './delete-directory';
import { DeleteFilesHandler } from './delete-file.handler';
import { RenameDirectoryHandler } from './rename-directory.handler';

export const fileAndDirectoryHandlers: Provider[] = [
  CreateDirectoryHandler,
  CreateFileHandler,
  DeleteFilesHandler,
  DeleteDirectoryHandler,
  RenameDirectoryHandler,
];
