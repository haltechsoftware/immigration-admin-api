import { Provider } from '@nestjs/common';
import { GetFileAndFolderByParentIdHandler } from './get-file-and-folder-by-parent-id.repository';

export const queryFileAndDirectory: Provider[] = [
  GetFileAndFolderByParentIdHandler,
];
