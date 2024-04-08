import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeFileUploadService } from 'src/infrastructure/file-upload/node/node-file-upload.service';
import { ArrivalRegistrationRepository } from '../../arrival-registration.repository';
import { UploadPassportImageCommand } from '../impl/upload-passport-image.command';

@CommandHandler(UploadPassportImageCommand)
export class UploadPassportImageHandler
  implements ICommandHandler<UploadPassportImageCommand, string>
{
  constructor(
    private readonly upload: NodeFileUploadService,
    private readonly repository: ArrivalRegistrationRepository,
  ) {}

  async execute({
    dto: { image, passport_number },
  }: UploadPassportImageCommand): Promise<string> {
    const exist = await this.repository.getPassport(passport_number);

    if (exist) {
      await this.upload.remove(exist.image);
    }

    return await this.upload.upload(
      'document/passport/',
      image.buffer,
      image.originalName,
    );
  }
}
