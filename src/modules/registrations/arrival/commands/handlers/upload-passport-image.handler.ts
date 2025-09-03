import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { ArrivalRegistrationRepository } from '../../arrival-registration.repository';
import { UploadPassportImageCommand } from '../impl/upload-passport-image.command';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { optimizeImage } from 'src/common/utils/image-optimize.util';

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

    const optimizedBuffer = await optimizeImage({
      buffer: image.buffer,
      originalName: image.originalName,
    }); // Log size in bytes
    console.log('Optimized buffer size (bytes):', optimizedBuffer.length);
    // Log size in KB
    console.log(
      'Optimized size (KB):',
      (optimizedBuffer.length / 1024).toFixed(2),
    );
    // Log size in MB
    console.log(
      'Optimized size (MB):',
      (optimizedBuffer.length / (1024 * 1024)).toFixed(2),
    );

    const uploadPath = join(process.cwd(), 'client', 'uploads');

    // ✅ Check if "uploads" folder exists, if not create it
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    return await this.upload.upload(
      'uploads/',
      optimizedBuffer,
      image.originalName,
    );
  }
}
