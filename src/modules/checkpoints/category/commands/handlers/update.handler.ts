import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { CheckpointCategoryRepository } from '../../checkpoint_category.repository';
import { UpdateCheckpointCategoryCommand } from '../impl/update.command';

@CommandHandler(UpdateCheckpointCategoryCommand)
export class UpdateCheckpointCategoryHandler
  implements ICommandHandler<UpdateCheckpointCategoryCommand>
{
  constructor(
    private readonly checkPointCategoryRepository: CheckpointCategoryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute({ input, id }: UpdateCheckpointCategoryCommand): Promise<any> {
    const res = await this.checkPointCategoryRepository.findOne(id);

    if (!res)
      throw new NotFoundException({
        message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ',
      });

    const conflict = await this.drizzle
      .db()
      .query.checkpointCategoryTranslate.findMany({
        where: (f, o) =>
          o.or(
            o.and(
              o.not(o.eq(f.id, input.lo.id)),
              o.eq(f.title, input.lo.title),
            ),
            o.and(
              o.not(o.eq(f.id, input.en.id)),
              o.eq(f.title, input.en.title),
            ),
            o.and(
              o.not(o.eq(f.id, input.zh_cn.id)),
              o.eq(f.title, input.zh_cn.title),
            ),
          ),
      });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    await this.checkPointCategoryRepository.update({
      id: res.id,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.en.id,
          title: input.en.title,
          description: input.en.description,
          lang: 'en',
          slug: generateSlug(input.en.title),
        },
        {
          id: input.lo.id,
          title: input.lo.title,
          description: input.lo.description,
          lang: 'lo',
          slug: generateSlug(input.lo.title),
        },
        {
          id: input.zh_cn.id,
          title: input.zh_cn.title,
          description: input.zh_cn.description,
          lang: 'zh_cn',
          slug: generateSlug(input.zh_cn.title),
        },
      ],
    });
    return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
  }
}
