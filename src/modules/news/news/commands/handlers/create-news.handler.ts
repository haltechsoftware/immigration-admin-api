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
import { CreateNewsCommand } from '../impl/create-news.command';

@CommandHandler(CreateNewsCommand)
export class CreateNewsHandler implements ICommandHandler<CreateNewsCommand> {
  constructor(
    @Inject(FILE_UPLOAD_SERVICE)
    private readonly fileUpload: IFileUpload,
    private readonly newsRepository: NewsRepository,
    private readonly drizzle: DrizzleService,
    private readonly newsCategoryRepository: NewsCategoryRepository,
  ) {}

  async execute({ input }: CreateNewsCommand): Promise<any> {
    if (
      input.lo.title === input.en.title ||
      input.zh_cn.title === input.en.title ||
      input.zh_cn.title === input.lo.title
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    if (input.category_id) {
      const newsCategory = await this.newsCategoryRepository.findOne(
        input.category_id,
      );

      if (!newsCategory)
        throw new NotFoundException({ message: 'ປະເພດຂ່າວບໍ່ມີ' });
    }

    const conflict = await this.drizzle.db().query.newsTranslate.findMany({
      where: (f, o) =>
        o.inArray(f.title, [input.lo.title, input.en.title, input.zh_cn.title]),
    });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    const image = await this.fileUpload.upload(
      'news/image/',
      input.thumbnail.buffer,
      input.thumbnail.originalName,
    );

    await this.newsRepository.create({
      category_id: input.category_id,
      thumbnail: image,
      status: input.status,
      public_at:
        input.status === NewsStatus.Public
          ? format(new Date(), DateTimeFormat.Timestamp)
          : undefined,
      translates: [
        {
          title: input.lo.title,
          slug: generateSlug(input.lo.title),
          description: input.lo.description,
          content: input.lo.content,
          lang: 'lo',
        },
        {
          title: input.en.title,
          slug: generateSlug(input.en.title),
          description: input.en.description,
          content: input.en.content,
          lang: 'en',
        },
        {
          title: input.zh_cn.title,
          slug: generateSlug(input.zh_cn.title),
          description: input.zh_cn.description,
          content: input.zh_cn.content,
          lang: 'zh_cn',
        },
      ],
    });
    return 'ບັນທຶກຂໍ້ມູນສຳເລັດ';
  }
}
