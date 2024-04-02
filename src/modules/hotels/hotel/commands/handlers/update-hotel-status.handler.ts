import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import UpdateHotelStatusCommand from "../imp/update-hotel-status.command";
import { HotelRepository } from "../../hotel.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(UpdateHotelStatusCommand)
export default class UpdatePrivatePopupHandler
  implements ICommandHandler<UpdateHotelStatusCommand, string>
{
  constructor(private readonly repository: HotelRepository) {}

  async execute({ input, id }: UpdateHotelStatusCommand): Promise<string> {
    const popup = await this.repository.findOne(id);

    if (!popup) throw new NotFoundException('ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ');

    await this.repository.updatePublished({
      id,
      is_published: input.is_published,
    });

    return 'ອັດເດດໂຮງແຮມສຳເລັດ';
  }
}
