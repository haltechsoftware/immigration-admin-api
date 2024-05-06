import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LawRepository } from '../../law.repository';
import CreateLawCommand from '../impl/create-law.command';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { Inject } from '@nestjs/common';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';

@CommandHandler(CreateLawCommand)
export default class CreateLawHandler
  implements ICommandHandler<CreateLawCommand, string>
{
  constructor(
    private readonly repository: LawRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ dto }: CreateLawCommand): Promise<string> {
    let file: string | undefined;

    if (dto.file) {
      file = await this.fileUpload.upload(
        'law/',
        dto.file.buffer,
        dto.file.originalName,
      );
    }

    await this.repository.create({
      file: file,
      name: dto.name,
    });

    return 'ເພີ່ມກົດລະບຽບສໍາເລັດ';
  }
}
