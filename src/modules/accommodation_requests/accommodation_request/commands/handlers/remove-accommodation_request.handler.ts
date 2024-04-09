import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletedAccommodationCommand } from '../impl/remove-accommodation_request.command';
import { AccommodationRequestRepository } from '../../accommodation_request.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeletedAccommodationCommand)
export class DeletedAccommodationHandler
  implements ICommandHandler<DeletedAccommodationCommand>
{
  constructor(private readonly _repository: AccommodationRequestRepository) {}
  async execute({ id }: DeletedAccommodationCommand): Promise<any> {
    const accommodation_request = await this._repository.findOne(id);

    if (!accommodation_request)
      throw new NotFoundException({ message: 'ໄອດີທີ່ຮ້ອງຂໍໄປ ບໍ່ພົບຂໍ້ມູນ' });
    await this._repository.remove(accommodation_request.id);
    return { message: 'ລົບຂໍ້ມູນສຳເລັດ' };
  }
}
