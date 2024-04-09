import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { AccommodationRequestRepository } from '../../accommodation-request.repository';
import { UpdatedAccommodationCommand } from '../impl/update-accommodation-request.command';

@CommandHandler(UpdatedAccommodationCommand)
export class UpdatedAccommodationHandler
  implements ICommandHandler<UpdatedAccommodationCommand>
{
  constructor(private readonly _repository: AccommodationRequestRepository) {}

  async execute({ id, input }: UpdatedAccommodationCommand): Promise<any> {
    const accommodation_request = await this._repository.findOne(id);

    if (!accommodation_request)
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກ' });

    await this._repository.update({
      id: accommodation_request.id,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.lo.id,
          title: input.lo.title,
          lang: 'lo',
          content: input.lo.content,
        },
        {
          id: input.en.id,
          title: input.en.title,
          lang: 'en',
          content: input.en.content,
        },
        {
          id: input.zh_cn.id,
          title: input.zh_cn.title,
          lang: 'zh_cn',
          content: input.zh_cn.content,
        },
      ],
    });
    return { message: 'ແກ້ໄຂຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກສຳເລັດ' };
  }
}
