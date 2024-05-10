import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { CheckpointCategoryRepository } from '../../checkpoint_category.repository';
import { CreateCheckPointCategoryCommand } from '../impl/create.command';

@CommandHandler(CreateCheckPointCategoryCommand)
export class CreateCheckpointCategoryHandler
  implements ICommandHandler<CreateCheckPointCategoryCommand>
{
  constructor(
    private readonly checkPointCategoryRepository: CheckpointCategoryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute({ input }: CreateCheckPointCategoryCommand): Promise<any> {
    const conflict = await this.drizzle
      .db()
      .query.checkpointCategoryTranslate.findMany({
        where: (f, o) =>
          o.inArray(f.title, [
            input.lo.title,
            input.en.title,
            input.zh_cn.title,
          ]),
      });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    await this.checkPointCategoryRepository.create({
      translates: [
        {
          title: input.lo.title,
          description: input.lo.description,
          lang: 'lo',
          slug: generateSlug(input.lo.title),
        },
        {
          title: input.en.title,
          description: input.en.description,
          lang: 'en',
          slug: generateSlug(input.en.title),
        },
        {
          title: input.zh_cn.title,
          description: input.zh_cn.description,
          lang: 'zh_cn',
          slug: generateSlug(input.zh_cn.title),
        },
      ],
    });

    return 'ເພີ່ມຂໍ້ມູນສຳເລັດ';
  }
}
