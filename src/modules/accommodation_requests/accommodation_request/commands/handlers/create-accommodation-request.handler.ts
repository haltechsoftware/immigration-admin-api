import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccommodationRequestRepository } from '../../accommodation-request.repository';
import { CreateAccommodationRequestCommand } from '../impl/create-accommodation-request.command';

@CommandHandler(CreateAccommodationRequestCommand)
export class CreateAccommodationRequestHandler
  implements ICommandHandler<CreateAccommodationRequestCommand>
{
  constructor(private readonly _repository: AccommodationRequestRepository) {}
  async execute({ input }: CreateAccommodationRequestCommand): Promise<any> {
    await this._repository.create({
      translates: [
        {
          title: input.lo.title,
          lang: 'lo',
          content: input.lo.content,
        },
        {
          title: input.en.title,
          lang: 'en',
          content: input.en.content,
        },
        {
          title: input.zh_cn.title,
          lang: 'zh_cn',
          content: input.zh_cn.content,
        },
      ],
    });
    return 'ບັນທຶກການຮ້ອງຂໍທີ່ພັກສຳເລັດ';
  }
}
