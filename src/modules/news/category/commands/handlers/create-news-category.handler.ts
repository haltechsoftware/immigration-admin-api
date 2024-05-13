import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { NewsCategoryRepository } from '../../news-cateory.repository';
import { CreateNewsCategoryCommand } from '../impl/create-news-category.command';
@CommandHandler(CreateNewsCategoryCommand)
export class CreateNewsCategoryHandler
  implements ICommandHandler<CreateNewsCategoryCommand>
{
  constructor(
    private readonly repository: NewsCategoryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute({ input }: CreateNewsCategoryCommand): Promise<any> {
    if (
      input.lo.name === input.en.name ||
      input.zh_cn.name === input.en.name ||
      input.zh_cn.name === input.lo.name
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    const conflict = await this.drizzle
      .db()
      .query.newsCategoriesTranslate.findMany({
        where: (f, o) =>
          o.inArray(f.name, [input.lo.name, input.en.name, input.zh_cn.name]),
      });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    await this.repository.create({
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

    return 'ບັນທຶກຂໍ້ມູນສຳເລັດ';
  }
}
