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
    const res = await this.drizzle.db().query.news.findFirst({
      with: {
        translates: {
          where: (f, o) => o.and(
            o.eq(f.lang, lang),
            o.eq(f.slug, slug)
          ),
        },
        category: {
          with: {
            translates: {
              where: (f, o) => o.eq(f.lang, lang), // Filter category translations by lang
            },
          },
        },
      },
    });

    // if (!res) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });
    if (!res || res.translates.length === 0) {
      throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });
    }

    // Retrieve related news articles
    const relatedNews = await this.drizzle.db().query.news.findMany({
      limit: 4,
      where: (f, o) => o.and(
        o.not(o.eq(f.id, res.id!)),  // Exclude the current news article
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

    return { ...res, relatedNews };  // Return both the main news and related news
  }
}
