import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PublicHotelCommand } from "../imp/public-hotel.command";
import { HotelRepository } from "../../hotel.repository";
import { BadRequestException, NotFoundException } from "@nestjs/common";

@CommandHandler(PublicHotelCommand)
export class PublicHotelHandler
  implements ICommandHandler<PublicHotelCommand>
{
  constructor(private readonly repository: HotelRepository) {}

  async execute({ id }: PublicHotelCommand): Promise<any> {
    const hotel = await this.repository.findOne(id);

    if (!hotel)
      throw new NotFoundException({ message: 'ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ' });

    if (hotel.is_published === false) {
      throw new BadRequestException({
        message: 'ບໍ່ສາມາດເປິດການມອງເຫັນຊໍ້າໄດ້',
      });
    }

    hotel.is_published = false;

    await this.repository.updatePublished(hotel);

    return 'ເປິດການມອງເຫັນສຳເລັດ';
  }
}