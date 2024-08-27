import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ServiceRepository } from '../../service.repository';
import { CreateServiceCommand } from '../impl/create-service.command';

@CommandHandler(CreateServiceCommand)
export class CreateServiceHandler
  implements ICommandHandler<CreateServiceCommand>
{
  constructor(private readonly _repository: ServiceRepository) {}
  async execute({ input }: CreateServiceCommand): Promise<any> {
    await this._repository.create({
      translates: [
        {
          title: input.lo.title,
          description: input.lo.description,
          lang: 'lo',
          content: input.lo.content,
        },
        {
          title: input.en.title,
          description: input.en.description,
          lang: 'en',
          content: input.en.content,
        },
        {
          title: input.zh_cn.title,
          description: input.zh_cn.description,
          lang: 'zh_cn',
          content: input.zh_cn.content,
        },
      ],
    });
    return 'ບັນທຶກບໍລິການສຳເລັດ';
  }
}
