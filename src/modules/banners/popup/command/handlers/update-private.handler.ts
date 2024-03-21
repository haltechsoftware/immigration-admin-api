import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PopupRepository } from "../../popup.repository";
import UpdatePrivatePopupCommand from "../impl/update-private-popup.command";
import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";


@CommandHandler(UpdatePrivatePopupCommand)
export default class UpdatePrivatePopupHandler
  implements ICommandHandler<UpdatePrivatePopupCommand, string>
{
  constructor(
    private readonly repository: PopupRepository,
  ) {}

  async execute({ dto,id }: UpdatePrivatePopupCommand): Promise<string> {
    const popup = await this.repository.getById(id);

    if (!popup)
      throw new NotFoundException('ບໍ່ມີໃນລະບົບ' );

    await this.repository.updatePrivate({
        id,
        is_private: dto.is_private,
    });

    return 'ອັດເດດສຳເລັດ';
  }
}