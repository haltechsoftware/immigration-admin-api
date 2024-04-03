import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { HotelRepository } from "../../hotel.repository";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PrivateHotelCommand } from "../imp/private-hotel.command";

@CommandHandler(PrivateHotelCommand)
export default class PrivateHotelHandler
  implements ICommandHandler<PrivateHotelCommand, string>
{
  constructor(private readonly repository: HotelRepository) {}

  async execute({ id }: PrivateHotelCommand): Promise<string> {
    const hotel = await this.repository.findOne(id);

    if (!hotel)
      throw new NotFoundException({ message: 'ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ' });

    if (hotel.is_published === true) {
      throw new BadRequestException({
        message: 'ບໍ່ສາມາດປິດການມອງເຫັນຊໍ້າໄດ້',
      });
    }

    hotel.is_published = true;

    await this.repository.updatePublished(hotel);

    return 'ປິດການມອງເຫັນສຳເລັດ';
  }
}
