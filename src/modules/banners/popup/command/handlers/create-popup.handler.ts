import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { PopupRepository } from '../../popup.repository';
import CreatePopupCommand from '../impl/create-popup.command';

@CommandHandler(CreatePopupCommand)
export default class CreateUserHandler
  implements ICommandHandler<CreatePopupCommand, string>
{
  constructor(
    private readonly repository: PopupRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ dto }: CreatePopupCommand): Promise<string> {
    let image: string | undefined;

    if (dto.image) {
      image = await this.fileUpload.upload(
        'banner/popup/',
        dto.image.buffer,
        dto.image.originalName,
      );
    }

    if (dto.end_time <= dto.start_time)
      throw new BadRequestException({
        message: 'ວັນທີສິ້ນສຸດຕ້ອງໃຫ່ຍກວ່າ ຫຼື ເທົ່າກັບວັນທີເລີ່ມ.',
      });

    await this.repository.create({
      image: image,
      link: dto.link,
      is_private: dto.is_private,
      start_time: format(dto.start_time, DateTimeFormat.Timestamp),
      end_time: format(dto.end_time, DateTimeFormat.Timestamp),
    });

    return 'ເພີ່ມປ໊ອບອັບສຳເລັດ';
  }
}
