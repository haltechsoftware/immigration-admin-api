import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ContactRepository } from '../../contact.repository';
import DeleteContactCommand from '../impl/delete-contact.command';

@CommandHandler(DeleteContactCommand)
export default class DeleteContactHandler
  implements ICommandHandler<DeleteContactCommand, string>
{
  constructor(private readonly repository: ContactRepository) {}

  async execute({ id }: DeleteContactCommand): Promise<string> {
    const contact = await this.repository.getById(id);

    if (!contact)
      throw new NotFoundException({
        message: 'ຂໍ້ມູນຕິດຕໍ່ພວກເຮົາບໍ່ມີໃນລະບົບ',
      });

    await this.repository.remove(id);

    return 'ລຶບຂໍ້ມູນຕິດຕໍ່ພວກເຮົາສຳເລັດ';
  }
}
