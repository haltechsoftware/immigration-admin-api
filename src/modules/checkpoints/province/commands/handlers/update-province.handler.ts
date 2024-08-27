import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { ProvinceRepository } from '../../province.repository';
import { UpdateProvinceCommand } from '../impl/update-province.command';

@CommandHandler(UpdateProvinceCommand)
export class UpdateProvinceHandler
  implements ICommandHandler<UpdateProvinceCommand>
{
  constructor(
    private readonly provinceRepository: ProvinceRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute({ input, id }: UpdateProvinceCommand): Promise<any> {
    if (
      input.lo.name === input.en.name ||
      input.zh_cn.name === input.en.name ||
      input.zh_cn.name === input.lo.name
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    const province = await this.provinceRepository.findOne(id);

    if (!province)
      throw new NotFoundException({ message: 'ແຂວງນີ້ບໍ່ມີໃນລະບົບ' });

    const conflict = await this.drizzle.db().query.provinceTranslate.findMany({
      where: (f, o) =>
        o.or(
          o.and(o.not(o.eq(f.id, input.lo.id)), o.eq(f.name, input.lo.name)),
          o.and(o.not(o.eq(f.id, input.en.id)), o.eq(f.name, input.en.name)),
          o.and(
            o.not(o.eq(f.id, input.zh_cn.id)),
            o.eq(f.name, input.zh_cn.name),
          ),
        ),
    });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    await this.provinceRepository.update({
      id: province.id,
      countries: input.countries,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.lo.id,
          name: input.lo.name,
          lang: 'lo',
          slug: generateSlug(input.lo.name),
        },
        {
          id: input.en.id,
          name: input.en.name,
          lang: 'en',
          slug: generateSlug(input.en.name),
        },
        {
          id: input.zh_cn.id,
          name: input.zh_cn.name,
          lang: 'zh_cn',
          slug: generateSlug(input.zh_cn.name),
        },
      ],
    });

    return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
  }
}
