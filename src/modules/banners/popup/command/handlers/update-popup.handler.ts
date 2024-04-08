import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { PopupRepository } from '../../popup.repository';
import UpdatePopupCommand from '../impl/update-popup.command';

@CommandHandler(UpdatePopupCommand)
export default class UpdatePopupHandler
  implements ICommandHandler<UpdatePopupCommand, string>
{
  constructor(
    private readonly repository: PopupRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ dto, id }: UpdatePopupCommand): Promise<string> {
    const popup = await this.repository.getById(id);

    if (!popup) throw new NotFoundException('ປ໊ອບອັບບໍ່ມີໃນລະບົບ');

    let image: string | undefined;

    if (dto.image) {
      await this.fileUpload.remove(popup.image);

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

    await this.repository.update({
      id,
      image: image,
      link: dto.link,
      is_private: dto.is_private,
      start_time: format(dto.start_time, DateTimeFormat.Timestamp),
      end_time: format(dto.end_time, DateTimeFormat.Timestamp),
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
    });

    return 'ອັດເດດປ໊ອບອັບສຳເລັດ';
  }
}
