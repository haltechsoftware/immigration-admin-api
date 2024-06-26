import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { ArrivalRegistrationRepository } from '../../arrival-registration.repository';
import { UploadVisaImageCommand } from '../impl/upload-visa-image.command';

@CommandHandler(UploadVisaImageCommand)
export class UploadVisaImageHandler
  implements ICommandHandler<UploadVisaImageCommand, string>
{
  constructor(
    @Inject(FILE_UPLOAD_SERVICE) private readonly upload: IFileUpload,
    private readonly repository: ArrivalRegistrationRepository,
  ) {}

  async execute({
    dto: { image, visa_number },
  }: UploadVisaImageCommand): Promise<string> {
    const exist = await this.repository.getVisa(visa_number);

    if (exist) {
      await this.upload.remove(exist.image);
    }

    return await this.upload.upload(
      'document/visa/',
      image.buffer,
      image.originalName,
    );
  }
}
