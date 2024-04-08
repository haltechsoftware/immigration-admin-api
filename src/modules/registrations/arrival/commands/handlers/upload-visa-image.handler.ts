import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeFileUploadService } from 'src/infrastructure/file-upload/node/node-file-upload.service';
import { ArrivalRegistrationRepository } from '../../arrival-registration.repository';
import { UploadVisaImageCommand } from '../impl/upload-visa-image.command';

@CommandHandler(UploadVisaImageCommand)
export class UploadVisaImageHandler
  implements ICommandHandler<UploadVisaImageCommand, string>
{
  constructor(
    private readonly upload: NodeFileUploadService,
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
