import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { LostPassportRepository } from '../../lost_passport.repository';
import { UpdatedLostPassportCommand } from '../impl/update-lost-passport.command';

@CommandHandler(UpdatedLostPassportCommand)
export class UpdatedLostPassportHandler
  implements ICommandHandler<UpdatedLostPassportCommand>
{
  constructor(private readonly _repository: LostPassportRepository) {}

  async execute({ id, input }: UpdatedLostPassportCommand): Promise<any> {
    const res = await this._repository.findOne(id);

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    await this._repository.update({
      id: res.id,
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
    return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
  }
}
