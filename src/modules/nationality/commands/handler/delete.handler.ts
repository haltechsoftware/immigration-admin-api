import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveNationalityCommand } from '../impl/delete.command';
import { NationalityRepository } from '../../nationality.repository';

@CommandHandler(RemoveNationalityCommand)
export class RemoveNationalityHandler
  implements ICommandHandler<RemoveNationalityCommand>
{
  constructor(private readonly repository: NationalityRepository) {}

  async execute({ id }: RemoveNationalityCommand): Promise<any> {
    const res = await this.repository.findOne(id);

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    await this.repository.remove(id);

    return 'ລົບຂໍ້ມູນສຳເລັດ';
  }
}
