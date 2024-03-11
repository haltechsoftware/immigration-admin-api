import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { extname } from 'path';
import { IFileUpload } from '../file-upload.interface';

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

    if (!existsSync('client/' + path)) await mkdir('client/' + path);

    const filePath = path + newFileName;

    try {
      await writeFile(`client/${filePath}`, buffer);
      return filePath;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async remove(path: string): Promise<void> {
    await unlink('client/' + path);
  }

  private generateUniqueFilename(base: string, extension: string): string {
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${base}-${randomString}.${extension}`;

    return filename;
  }
}
