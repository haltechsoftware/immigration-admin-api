import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { NewsCategoryRepository } from 'src/modules/news/category/news-cateory.repository';
import { NewsStatus } from '../../dtos/create-news.dto';
import { NewsRepository } from '../../news.repository';
import { UpdateNewsCommand } from '../impl/update-news.command';

@CommandHandler(UpdateNewsCommand)
export class UpdateNewsCategoryHandler
  implements ICommandHandler<UpdateNewsCommand>
{
  constructor(
    @Inject(FILE_UPLOAD_SERVICE)
    private readonly fileUpload: IFileUpload,
    private readonly newsRepository: NewsRepository,
    private readonly newsCategoryRepository: NewsCategoryRepository,
    private readonly drizzle: DrizzleService,
  ) {}
  async execute({ id, input }: UpdateNewsCommand): Promise<any> {
    if (
      input.lo.title === input.en.title ||
      input.zh_cn.title === input.en.title ||
      input.zh_cn.title === input.lo.title
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    const news = await this.newsRepository.findOne(id);

    if (!news) throw new NotFoundException({ message: 'ຂ່າວນີ້ບໍ່ມີ' });

    const newsCategory = await this.newsCategoryRepository.findOne(
      input.category_id,
    );

    if (!newsCategory)
      throw new NotFoundException({ message: 'ປະເພດຂ່າວບໍ່ມີ' });

    const conflict = await this.drizzle.db().query.newsTranslate.findMany({
      where: (f, o) =>
        o.or(
          o.and(o.not(o.eq(f.id, input.lo.id)), o.eq(f.title, input.lo.title)),
          o.and(o.not(o.eq(f.id, input.en.id)), o.eq(f.title, input.en.title)),
          o.and(
            o.not(o.eq(f.id, input.zh_cn.id)),
            o.eq(f.title, input.zh_cn.title),
          ),
        ),
    });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    let imageUrl: string | undefined;
    if (input.thumbnail) {
      await this.fileUpload.remove(news.thumbnail);

      imageUrl = await this.fileUpload.upload(
        'news/image/',
        input.thumbnail.buffer,
        input.thumbnail.originalName,
      );
    }

    await this.newsRepository.update({
      id: news.id,
      category_id: newsCategory.id,
      thumbnail: imageUrl,
      status: input.status,
      public_at:
        input.status === NewsStatus.Public
          ? format(new Date(), DateTimeFormat.Timestamp)
          : undefined,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.lo.id,
          title: input.lo.title,
          slug: generateSlug(input.lo.title),
          description: input.lo.description,
          content: input.lo.content,
          lang: 'lo',
        },
        {
          id: input.en.id,
          title: input.en.title,
          slug: generateSlug(input.en.title),
          description: input.en.description,
          content: input.en.content,
          lang: 'en',
        },
        {
          id: input.zh_cn.id,
          title: input.zh_cn.title,
          slug: generateSlug(input.zh_cn.title),
          description: input.zh_cn.description,
          content: input.zh_cn.content,
          lang: 'zh_cn',
        },
      ],
    });
    return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
  }
}
