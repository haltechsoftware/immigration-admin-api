import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VisaCategoryRepository } from '../../visa_category.repository';
import CreateVisaCategoryCommand from '../impl/create-visa_category.command';

@CommandHandler(CreateVisaCategoryCommand)
export default class CreateVisaCategoryHandler
  implements ICommandHandler<CreateVisaCategoryCommand, string>
{
  constructor(private readonly _repository: VisaCategoryRepository) {}
  async execute({ dto }: CreateVisaCategoryCommand): Promise<string> {
    await this._repository.create({
      translates: [
        {
          name: dto.lo.name,
          lang: 'lo',
          content: dto.lo.content,
        },
        {
          name: dto.en.name,
          lang: 'en',
          content: dto.en.content,
        },
        {
          name: dto.zh_cn.name,
          lang: 'zh_cn',
          content: dto.zh_cn.content,
        },
      ],
    });

    return 'ບັນທຶກຂໍ້ມູນປະເພດວີຊາສຳເລັດ';
  }
}
