import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { LawRepository } from '../../law.repository';
import CreateLawCommand from '../impl/create-law.command';

@CommandHandler(CreateLawCommand)
export default class CreateLawHandler
  implements ICommandHandler<CreateLawCommand, string>
{
  constructor(
    private readonly repository: LawRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ dto }: CreateLawCommand): Promise<string> {
    const file = await this.fileUpload.upload(
      'law/file/',
      dto.file.buffer,
      dto.file.originalName,
      dto.file.mimeType,
    );

    await this.repository.create({
      file,
      name: dto.name,
    });

    return 'ເພີ່ມກົດໝາຍສໍາເລັດ';
  }
}
