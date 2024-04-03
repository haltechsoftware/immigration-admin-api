import { Provider } from '@nestjs/common';
import { GetAllFilesAndDirectoryHandler } from './get-all-repository';

export const queryFileAndDirectory: Provider[] = [
  GetAllFilesAndDirectoryHandler,
];
