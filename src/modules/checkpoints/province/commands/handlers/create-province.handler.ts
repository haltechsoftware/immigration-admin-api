import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import generateSlug from 'src/common/utils/generate-slug';
import { ProvinceRepository } from '../../province.repository';
import { CreateProvinceCommand } from '../impl/create-province.command';

@CommandHandler(CreateProvinceCommand)
export class CreateProvinceHandler
  implements ICommandHandler<CreateProvinceCommand>
{
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async execute({ input }: CreateProvinceCommand): Promise<any> {
    if (
      input.lo.name === input.en.name ||
      input.zh_cn.name === input.en.name ||
      input.zh_cn.name === input.lo.name
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    await this.provinceRepository.create({
      countries: input.countries,
      translates: [
        {
          name: input.lo.name,
          lang: 'lo',
          slug: generateSlug(input.lo.name),
        },
        {
          name: input.en.name,
          lang: 'en',
          slug: generateSlug(input.en.name),
        },
        {
          name: input.zh_cn.name,
          lang: 'zh_cn',
          slug: generateSlug(input.zh_cn.name),
        },
      ],
    });

    return 'ເພີ່ມຂໍ້ມູນສຳເລັດ';
  }
}
