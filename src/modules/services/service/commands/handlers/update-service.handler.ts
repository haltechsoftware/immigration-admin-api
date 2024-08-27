import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { ServiceRepository } from '../../service.repository';
import { UpdatedServiceCommand } from '../impl/update-service.command';

@CommandHandler(UpdatedServiceCommand)
export class UpdateServiceHandler
  implements ICommandHandler<UpdatedServiceCommand>
{
  constructor(private readonly _repository: ServiceRepository) {}

  async execute({ id, input }: UpdatedServiceCommand): Promise<any> {
    const service = await this._repository.findOne(id);

    if (!service)
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນບໍລິການ' });

    await this._repository.update({
      id: service.id,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.lo.id,
          title: input.lo.title,
          description: input.lo.description,
          lang: 'lo',
          content: input.lo.content,
        },
        {
          id: input.en.id,
          title: input.en.title,
          description: input.en.description,
          lang: 'en',
          content: input.en.content,
        },
        {
          id: input.zh_cn.id,
          title: input.zh_cn.title,
          description: input.zh_cn.description,
          lang: 'zh_cn',
          content: input.zh_cn.content,
        },
      ],
    });
    return 'ແກ້ໄຂຂໍ້ມູນບໍລິການສຳເລັດ';
  }
}
