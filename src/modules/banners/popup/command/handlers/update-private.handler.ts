import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PopupRepository } from '../../popup.repository';
import UpdatePrivatePopupCommand from '../impl/update-private-popup.command';

@CommandHandler(UpdatePrivatePopupCommand)
export default class UpdatePrivatePopupHandler
  implements ICommandHandler<UpdatePrivatePopupCommand, string>
{
  constructor(private readonly repository: PopupRepository) {}

  async execute({ dto, id }: UpdatePrivatePopupCommand): Promise<string> {
    const popup = await this.repository.getById(id);

    if (!popup) throw new NotFoundException('ປ໊ອບອັບບໍ່ມີໃນລະບົບ');

    await this.repository.updatePrivate({
      id,
      is_private: dto.is_private,
    });

    return 'ອັດເດດປ໊ອບອັບສຳເລັດ';
  }
}
