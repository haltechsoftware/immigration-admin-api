import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ServiceRepository } from '../../service.repository';
import { RemoveServiceCommand } from '../impl/remove-service.command';

@CommandHandler(RemoveServiceCommand)
export class RemoveServiceHandler
  implements ICommandHandler<RemoveServiceCommand>
{
  constructor(private readonly _repository: ServiceRepository) {}
  async execute({ id }: RemoveServiceCommand): Promise<any> {
    const s = await this._repository.findOne(id);

    if (!s) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນການບໍລິການ' });

    await this._repository.remove(s.id);

    return 'ລົບຂໍ້ມູນການບໍລິການສຳເລັດ';
  }
}
