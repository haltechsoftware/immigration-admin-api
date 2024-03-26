import { Injectable, Provider } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { extname } from 'path';
import { IFileUpload } from '../file-upload.interface';
import { FILE_UPLOAD_SERVICE } from '../inject-key';

@Injectable()
export class SupabaseStorageService implements IFileUpload {
  private supabase = createClient(
    'https://mrfjgdhkjyppavoiejri.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZmpnZGhranlwcGF2b2llanJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0NzA1ODMsImV4cCI6MjAyNzA0NjU4M30.ggM0CdCOJTNXhJMOm12FxYP-lBtVlVyuG3HbLOl8KO4',
  );

  async upload(
    path: string,
    buffer: Buffer,
    fileName: string,
  ): Promise<string> {
    const [name] = fileName.split('.');
    const extension = extname(fileName);

    const newFileName = this.generateUniqueFilename(name, extension);

    const filePath = path + newFileName;

    const { data, error } = await this.supabase.storage
      .from('immigration')
      .upload(filePath, buffer);

    if (error) console.log(error);

    return data.path;
  }

  async remove(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from('immigration')
      .remove([path]);

    if (error) console.log(error);
  }

  private generateUniqueFilename(base: string, extension: string): string {
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${base}-${randomString}.${extension}`;

    return filename;
  }
}

export const SupabaseStorageProvider: Provider = {
  provide: FILE_UPLOAD_SERVICE,
  useClass: SupabaseStorageService,
};
