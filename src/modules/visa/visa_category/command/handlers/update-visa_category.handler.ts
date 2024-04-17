import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { VisaCategoryRepository } from '../../visa_category.repository';
import { UpdateVisaCategoryCommand } from '../impl/update-visa_category.command';

@CommandHandler(UpdateVisaCategoryCommand)
export class UpdateVisaCategoryHandler
  implements ICommandHandler<UpdateVisaCategoryCommand>
{
  constructor(private readonly _repository: VisaCategoryRepository) {}

  async execute({ id, input }: UpdateVisaCategoryCommand): Promise<any> {
    const visa_category = await this._repository.findOne(id);

    if (!visa_category)
      throw new NotFoundException({ message: 'ປະເພດວີຊານີ້ບໍ່ມີໃນລະບົບ' });
    await this._repository.update({
      id: visa_category.id,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.lo.id,
          name: input.lo.name,
          lang: 'lo',
          content: input.lo.content,
        },
        {
          id: input.en.id,
          name: input.en.name,
          lang: 'en',
          content: input.en.content,
        },
        {
          id: input.zh_cn.id,
          name: input.zh_cn.name,
          lang: 'zh_cn',
          content: input.zh_cn.content,
        },
      ],
    });

    return 'ອັດເດດຂໍ້ມູນສຳເລັດ';
  }
}
