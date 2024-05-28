import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LostPassportRepository } from '../../lost_passport.repository';
import { CreateLostPassportCommand } from '../impl/create-lost-passport.command';

@CommandHandler(CreateLostPassportCommand)
export class CreateLostPassportHandler
  implements ICommandHandler<CreateLostPassportCommand>
{
  constructor(private readonly _repository: LostPassportRepository) {}
  async execute({ input }: CreateLostPassportCommand): Promise<any> {
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
    return 'ບັນທຶກຂໍ້ມູນສຳເລັດ';
  }
}
