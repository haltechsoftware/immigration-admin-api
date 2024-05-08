export interface IFileUpload {
  upload(
    path: string,
    buffer: Buffer,
    fileName: string,
    contentType?: string,
  ): Promise<string>;

  remove(path: string): Promise<void>;
}
