import { Module } from '@nestjs/common';
import { fileAndDirectoryHandlers } from './commands/handlers';
import { FileAndDirectoryRepository } from './file_and_directory.repository';
import { FileAndDirectoryController } from './file_and_directory.controller';
import { queryFileAndDirectory } from './queries/handlers';

@Module({
    controllers: [FileAndDirectoryController],
    providers: [
        ...fileAndDirectoryHandlers,
        FileAndDirectoryRepository,
        ...queryFileAndDirectory
    ]
})
export class FileAndDirectoryModule {}
