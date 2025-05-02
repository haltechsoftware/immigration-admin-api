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
      where: (f, o) => o.and(o.eq(f.lang, lang), o.eq(f.slug, slug)),
      // with: {
      //   news: {
      //     columns: {
      //       id: false,
      //       category_id: false,
      //       thumbnail: false,
      //       public_at: false,
      //       status: false,
      //       created_at: false,
      //       updated_at: false,
      //     },
      //     with: {
      //       category: {
      //         with: {
      //           translates: {
      //             where: (f, o) => o.eq(f.lang, lang),
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    });

    if (!translate) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

    // Retrieve related news articles
    if (translate && translate.news_id) {
      const relatedNews = await this.drizzle.db().query.news.findMany({
        limit: 4,
        where: (f, o) => o.and(
          o.not(o.eq(f.id, translate.news_id!)),  // Exclude the current news article
          o.eq(f.status, 'published')  // Only include published news
        ),
        columns: {
          status: false,
          category_id: false,
          created_at: false,
          updated_at: false,
        },
        with: {
          translates: {
            where: (f, o) => o.eq(f.lang, lang),  // Filter related news by lang
          },
        },
        orderBy: sql`RAND()`,  // Order related news randomly
      });

      // return { ...translate, ...translate.news.category.translates[0], relatedNews };  // Return both the main news and related news
      // const categoryTranslation = translate.news?.category?.translates?.[0] || null; // Get the first category translation or null
      const result = {
        ...translate,
        // translates: categoryTranslation, //  'translates' for the category translation
        relatedNews,
      };

      return result;
    } else {
      return undefined;
    }
  }
}
