import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { UploadFeedbackMediaCommand } from '../impl/upload-feedback-media.command';

@CommandHandler(UploadFeedbackMediaCommand)
export class UploadFeedbackMediaHandler
  implements ICommandHandler<UploadFeedbackMediaCommand, string>
{
  constructor(
    @Inject(FILE_UPLOAD_SERVICE) private readonly upload: IFileUpload,
  ) {}

  async execute({
    dto: { media },
  }: UploadFeedbackMediaCommand): Promise<string> {
    return await this.upload.upload(
      'feedback/media/',
      media.buffer,
      media.originalName,
    );
  }
}
