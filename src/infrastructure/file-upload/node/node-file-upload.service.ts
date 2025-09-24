import { Injectable, Provider } from '@nestjs/common';
import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { extname, join, resolve } from 'path';
import { IFileUpload } from '../file-upload.interface';
import { FILE_UPLOAD_SERVICE } from '../inject-key';

@Injectable()
export class NodeFileUploadService implements IFileUpload {
  async upload(
    path: string,
    buffer: Buffer,
    fileName: string,
  ): Promise<string> {
    const extension = extname(fileName);
    const newFileName = this.generateUniqueFilename(extension);

    const basePath = resolve(process.cwd(), 'client');
    const fullPath = join(basePath, path);
    await mkdir(fullPath, { recursive: true });
    const filePath = join(fullPath, newFileName);

    try {
      await writeFile(filePath, buffer);
      return `client/${path}${newFileName}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // // const [name] = fileName.split('.');
    // const extension = extname(fileName);

    // // const truncatedName = name.substring(0, 25);
    // const newFileName = this.generateUniqueFilename(extension);

    // // let existsPath = 'client/';
    // // console.log('process', resolve(process.cwd()));
    // const existsPath = resolve(process.cwd(), 'client');

    // let currentPath = existsPath;

    // for (const val of path.split('/')) {
    //   // existsPath = existsPath + val + '/';
    //   // console.log('existsPath', existsPath);
    //   currentPath = join(currentPath, val);
    //   if (val && !existsSync(existsPath)) {
    //     try {
    //       await mkdir(existsPath, { recursive: true });
    //     } catch (err) {
    //       console.error('Error creating directory:', err);
    //     }
    //   }
    // }

    // const filePath = `client/${path}${newFileName}`;

    // try {
    //   await writeFile(filePath, buffer);
    //   return filePath;
    // } catch (error) {
    //   console.error('Error uploading file:', error);
    //   throw error;
    // }
  }

  async remove(path: string): Promise<void> {
    await unlink(path);
  }

  private generateUniqueFilename(extension: string): string {
    // const baseWithoutSpaces = base.replace(/\s+/g, '-').toLowerCase();
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const microseconds = String(now.getMilliseconds()).padStart(3, '0') + '000';
    // milliseconds (3 digits) + pad to 6 digits

    const baseWithoutSpaces = `${year}${month}${day}${hours}${minutes}${seconds}${microseconds}`;
    const randomString = Math.random().toString(36).substring(2, 8);
    const filename = `${baseWithoutSpaces}-${randomString}${extension}`;

    return filename;
  }
}

export const NodeFileUploadProvider: Provider = {
  provide: FILE_UPLOAD_SERVICE,
  useClass: NodeFileUploadService,
};
