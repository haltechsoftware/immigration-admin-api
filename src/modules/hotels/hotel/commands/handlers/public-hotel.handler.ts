import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HotelRepository } from '../../hotel.repository';
import { PublicHotelCommand } from '../imp/public-hotel.command';

@CommandHandler(PublicHotelCommand)
export class PublicHotelHandler implements ICommandHandler<PublicHotelCommand> {
  constructor(private readonly repository: HotelRepository) {}

  async execute({ id }: PublicHotelCommand): Promise<any> {
    const hotel = await this.repository.findOne(id);

    if (!hotel)
      throw new NotFoundException({ message: 'ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ' });

    if (hotel.is_published === true) {
      throw new BadRequestException({
        message: 'ບໍ່ສາມາດເປິດການມອງເຫັນຊໍ້າໄດ້',
      });
    }

    hotel.is_published = true;

    await this.repository.updatePublished(hotel);

    return 'ເປິດການມອງເຫັນສຳເລັດ';
  }
}
