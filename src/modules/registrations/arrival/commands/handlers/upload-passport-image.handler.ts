import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { ArrivalRegistrationRepository } from '../../arrival-registration.repository';
import { UploadPassportImageCommand } from '../impl/upload-passport-image.command';

@CommandHandler(UploadPassportImageCommand)
export class UploadPassportImageHandler
  implements ICommandHandler<UploadPassportImageCommand, string>
{
  constructor(
    @Inject(FILE_UPLOAD_SERVICE) private readonly upload: IFileUpload,
    private readonly repository: ArrivalRegistrationRepository,
  ) {}

  async execute({
    dto: { image, passport_number },
  }: UploadPassportImageCommand): Promise<string> {
    const exist = await this.repository.getPassport(passport_number);

    if (exist) {
      await this.upload.remove(exist.image);
    }

    // return await this.upload.upload(
    //   'document/passport/',
    //   image.buffer,
    //   image.originalName,
    // );
    return await this.upload.upload(
      'uploads/',
      image.buffer,
      image.originalName,
    );
  }
}
