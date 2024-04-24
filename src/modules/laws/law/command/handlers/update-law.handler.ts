import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { LawRepository } from '../../law.repository';
import UpdateLawCommand from '../impl/update-law.command';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';

@CommandHandler(UpdateLawCommand)
export default class UpdateLawHandler
  implements ICommandHandler<UpdateLawCommand, string>
{
  constructor(
    private readonly repository: LawRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ dto, id }: UpdateLawCommand): Promise<string> {
    const law = await this.repository.getById(id);

    if (!law)
      throw new NotFoundException('ກົດລະບຽບທີ່ຕ້ອງການອັບເດດບໍ່ມີໃນລະບົບ');

    let file: string | undefined;

    if (dto.file) {
      await this.fileUpload.remove(law.file);

      file = await this.fileUpload.upload(
        'law/',
        dto.file.buffer,
        dto.file.originalName,
      );
    }

    await this.repository.update({
      id,
      file: file,
      name: dto.name,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
    });

    return 'ອັບເດດກົດລະບຽບສໍາເລັດ';
  }
}
