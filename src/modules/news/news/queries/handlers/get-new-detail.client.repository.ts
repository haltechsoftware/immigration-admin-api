import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneClientNewsQuery } from '../impl/get-new-detail-client.query';

@QueryHandler(GetOneClientNewsQuery)
export class GetNewsDetailClientHandler implements IQueryHandler<GetOneClientNewsQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    params: slug,
    query: { lang },
  }: GetOneClientNewsQuery): Promise<any> {
    
    // Retrieve the main news record with its translations
    // const res = await this.drizzle.db().query.news.findMany({
    //   with: {
    //     translates: {
    //       where: (f, o) => o.and(
    //         o.eq(f.lang, lang),
    //         o.eq(f.slug, slug)
    //       ),
    //     },
    //     category: {
    //       with: {
    //         translates: {
    //           where: (f, o) => o.eq(f.lang, lang), // Filter category translations by lang
    //         },
    //       },
    //     },
    //   },
    // });

    const translate = await this.drizzle.db().query.newsTranslate.findFirst({
      where: (f, o) => o.eq(f.slug, slug),
      columns: { news_id: true },
    });

    if (!translate) {
      throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });
    }

    const data = await this.drizzle.db().query.news.findFirst({
      columns: {
        category_id: false,
        created_at: false,
        updated_at: false,
        status: false,
      },
      where: (f, o) => o.and(
        o.eq(f.status, "published"),
        o.eq(f.id, translate.news_id)
      ),
      with: {
        translates: {
          where: (f, o) => o.eq(f.lang, lang),
        },
      },
    });

    if (!data || !data.translates?.length) {
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນພາສາທີ່ທ່ານຮ້ອງຂໍ' });
    }

    const translation = data.translates[0];

    const relatedNews = await this.drizzle.db().query.news.findMany({
      limit: 4,
      where: (f, o) =>
        o.and(
          o.not(o.eq(f.id, translate.news_id)),
          o.eq(f.status, 'published')
        ),
      columns: {
        status: false,
        category_id: false,
        created_at: false,
        updated_at: false,
      },
      with: {
        translates: {
          where: (f, o) => o.eq(f.lang, lang),
        },
      },
      orderBy: sql`RAND()`,
    });

    return {
      id: translation.id,
      news_id: translation.news_id,
      title: translation.title,
      slug: translation.slug,
      description: translation.description,
      content: translation.content,
      lang: translation.lang,
      thumbnail: data.thumbnail,
      relatedNews,
    };
  }
}
