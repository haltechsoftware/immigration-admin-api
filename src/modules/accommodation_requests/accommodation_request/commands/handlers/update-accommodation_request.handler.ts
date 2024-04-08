import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatedAccommodationCommand } from '../impl/update-accommodation_request.command';
import { AccommodationRequestRepository } from '../../accommodation_request.repository';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdatedAccommodationCommand)
export class UpdatedAccommodationHandler
  implements ICommandHandler<UpdatedAccommodationCommand>
{
  constructor(private readonly _repository: AccommodationRequestRepository) {}
  async execute({ id, input }: UpdatedAccommodationCommand): Promise<any> {
    const accommodation_request = await this._repository.findOne(id);
    if (!accommodation_request)
      throw new NotFoundException({ message: 'ໄອດີທີ່ຮ້ອງຂໍໄປ ບໍ່ພົບຂໍ້ມູນ' });

    await this._repository.update({
      id: accommodation_request.id,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.en_id,
          title: input.en_title,
          lang: 'en',
          content: input.en_content,
        },
        {
          id: input.lo_id,
          title: input.lo_title,
          lang: 'lo',
          content: input.lo_content,
        },
        {
          id: input.zh_cn_id,
          title: input.zh_cn_title,
          lang: 'zh_cn',
          content: input.zh_cn_content,
        },
      ],
    });
    return { message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ' };
  }
}
