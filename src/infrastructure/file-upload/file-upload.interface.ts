export interface IFileUpload {
  upload(path: string, buffer: Buffer, fileName: string): Promise<string>;

  remove(path: string): Promise<void>;
}
