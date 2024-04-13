import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccommodationRequestRepository } from '../../accommodation-request.repository';
import { DeletedAccommodationCommand } from '../impl/remove-accommodation-request.command';

@CommandHandler(DeletedAccommodationCommand)
export class DeletedAccommodationHandler
  implements ICommandHandler<DeletedAccommodationCommand>
{
  constructor(private readonly _repository: AccommodationRequestRepository) {}
  async execute({ id }: DeletedAccommodationCommand): Promise<any> {
    const accommodation_request = await this._repository.findOne(id);

    if (!accommodation_request)
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກ' });

    await this._repository.remove(accommodation_request.id);

    return 'ລົບຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກສຳເລັດ';
  }
}
