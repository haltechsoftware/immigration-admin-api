import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LostPassportRepository } from '../../lost_passport.repository';
import { DeletedLostPassportCommand } from '../impl/remove-lost-passport.command';

@CommandHandler(DeletedLostPassportCommand)
export class DeletedLostPassportHandler
  implements ICommandHandler<DeletedLostPassportCommand>
{
  constructor(private readonly _repository: LostPassportRepository) {}
  async execute({ id }: DeletedLostPassportCommand): Promise<any> {
    const res = await this._repository.findOne(id);

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    await this._repository.remove(res.id);

    return 'ລົບຂໍ້ມູນສຳເລັດ';
  }
}
