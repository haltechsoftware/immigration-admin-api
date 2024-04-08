import { Module } from '@nestjs/common';
import { fileAndDirectoryHandlers } from './commands/handlers';
import { FileAndDirectoryController } from './file-and-directory.controller';
import { FileAndDirectoryRepository } from './file-and-directory.repository';
import { queryFileAndDirectory } from './queries/handlers';

@Module({
  controllers: [FileAndDirectoryController],
  providers: [
    ...fileAndDirectoryHandlers,
    FileAndDirectoryRepository,
    ...queryFileAndDirectory,
  ],
})
export class FileAndDirectoryModule {}
