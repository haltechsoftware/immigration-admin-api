import { Injectable, Provider } from '@nestjs/common';
import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { extname } from 'path';
import { IFileUpload } from '../file-upload.interface';
import { FILE_UPLOAD_SERVICE } from '../inject-key';

@Injectable()
export class NodeFileUploadService implements IFileUpload {
  async upload(
    path: string,
    buffer: Buffer,
    fileName: string,
  ): Promise<string> {
    const [name] = fileName.split('.');
    const extension = extname(fileName);

    const newFileName = this.generateUniqueFilename(name, extension);

    let existsPath = 'client/';

    for (const val of path.split('/')) {
      existsPath = existsPath + val + '/';
      if (val && !existsSync(existsPath)) {
        try {
          await mkdir(existsPath, { recursive: true });
        } catch (err) {
          console.error('Error creating directory:', err);
        }
      }
    }

    const filePath = `client/${path}${newFileName}`;

    try {
      await writeFile(filePath, buffer);
      return filePath;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async remove(path: string): Promise<void> {
    await unlink(path);
  }

  private generateUniqueFilename(base: string, extension: string): string {
    const baseWithoutSpaces = base.replace(/\s+/g, '-').toLowerCase();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${baseWithoutSpaces}-${randomString}${extension}`;

    return filename;
  }
}

export const NodeFileUploadProvider: Provider = {
  provide: FILE_UPLOAD_SERVICE,
  useClass: NodeFileUploadService,
};
