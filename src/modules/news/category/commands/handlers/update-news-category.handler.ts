import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { NewsCategoryRepository } from '../../news-cateory.repository';
import { UpdateNewsCategoryCommand } from '../impl/update-news-category.command';

@CommandHandler(UpdateNewsCategoryCommand)
export class UpdateNewsCategoryHandler
  implements ICommandHandler<UpdateNewsCategoryCommand>
{
  constructor(
    private readonly _repository: NewsCategoryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute({ id, input }: UpdateNewsCategoryCommand): Promise<any> {
    const newsCategory = await this._repository.findOne(id);

    if (!newsCategory) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    const conflict = await this.drizzle
      .db()
      .query.newsCategoriesTranslate.findMany({
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

    console.log(conflict);

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    await this._repository.update({
      id,
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
