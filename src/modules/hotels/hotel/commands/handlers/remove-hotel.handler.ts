import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { RemoveHotelCommand } from '../imp/remove-hotel.command';
import { HotelRepository } from '../../hotel.repository';

@CommandHandler(RemoveHotelCommand)
export default class RemoveHotelHandler
  implements ICommandHandler<RemoveHotelCommand, string>
{
  constructor(
    private readonly repository: HotelRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ id }: RemoveHotelCommand): Promise<string> {
    const popup = await this.repository.findOne(id);

    if (!popup) throw new NotFoundException({ message: 'ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ' });

    await this.fileUpload.remove(popup.image);

    await this.repository.remove(id);

    return 'ລຶບໂຮງແຮມສຳເລັດ';
  }
}
