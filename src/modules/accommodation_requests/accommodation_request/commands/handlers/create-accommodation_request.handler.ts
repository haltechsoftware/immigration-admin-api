import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccommodationRequestCommand } from '../impl/create-accommodation_request.command';
import { AccommodationRequestRepository } from '../../accommodation_request.repository';

@CommandHandler(CreateAccommodationRequestCommand)
export class CreateAccommodationRequestHandler
  implements ICommandHandler<CreateAccommodationRequestCommand>
{
  constructor(private readonly _repository: AccommodationRequestRepository) {}
  async execute({ input }: CreateAccommodationRequestCommand): Promise<any> {
    await this._repository.create({
      translates: [
        {
          title: input.en_title,
          lang: 'en',
          content: input.en_content,
        },
        {
          title: input.lo_title,
          lang: 'lo',
          content: input.lo_content,
        },
        {
          title: input.zh_cn_title,
          lang: 'zh_cn',
          content: input.zh_cn_content,
        },
      ],
    });
    return { message: 'ບັນທຶກສຳເລັດ' };
  }
}
