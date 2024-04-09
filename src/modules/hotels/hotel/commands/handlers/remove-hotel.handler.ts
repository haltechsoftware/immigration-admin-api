import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { HotelRepository } from '../../hotel.repository';
import { RemoveHotelCommand } from '../imp/remove-hotel.command';

@CommandHandler(RemoveHotelCommand)
export default class RemoveHotelHandler
  implements ICommandHandler<RemoveHotelCommand, string>
{
  constructor(
    private readonly repository: HotelRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ id }: RemoveHotelCommand): Promise<string> {
    const hotel = await this.repository.findOne(id);

    if (!hotel)
      throw new NotFoundException({ message: 'ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ' });

    await this.fileUpload.remove(hotel.image);

    await this.repository.remove(id);

    return 'ລຶບໂຮງແຮມສຳເລັດ';
  }
}
