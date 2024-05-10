import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { ProvinceRepository } from '../../province.repository';
import { CreateProvinceCommand } from '../impl/create-province.command';

@CommandHandler(CreateProvinceCommand)
export class CreateProvinceHandler
  implements ICommandHandler<CreateProvinceCommand>
{
  constructor(
    private readonly provinceRepository: ProvinceRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute({ input }: CreateProvinceCommand): Promise<any> {
    const conflict = await this.drizzle.db().query.provinceTranslate.findMany({
      where: (f, o) =>
        o.inArray(f.name, [input.lo.name, input.en.name, input.zh_cn.name]),
    });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    if (input.country_ids.length > 0) {
      const countries = await this.drizzle.db().query.countries.findMany({
        where: (f, o) => o.inArray(f.id, input.country_ids),
      });

      if (countries.length !== input.country_ids.length)
        throw new NotFoundException({
          message: 'ຂໍ້ມູນບາງລາຍການບໍ່ມີໃນລະບົບ!',
        });
    }

    await this.provinceRepository.create({
      countryIds: input.country_ids,
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
