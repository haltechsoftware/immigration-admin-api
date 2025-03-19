import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneClientNewsQuery } from '../impl/get-new-detail-client.query';

@QueryHandler(GetOneClientNewsQuery)
export class GetNewsDetailClientHandler implements IQueryHandler<GetOneClientNewsQuery> {
  constructor(private readonly drizzle: DrizzleService) {}
  private prepared = this.drizzle
  .db()
  .query.news.findFirst({
    where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    with: {
      translates: {
        where: (fields, { eq }) => eq(fields.lang, sql.placeholder('lang')),
      },
      category: { with: { translates: {
        where: (fields, { eq }) => eq(fields.lang, sql.placeholder('lang')),
      } } },
    },
  })
  .prepare();

  async execute({
    params: id,
    query: { lang },
  }: GetOneClientNewsQuery): Promise<any> {
    const res = await this.prepared.execute({ id, lang });

    if (!res) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

    const relatedNews = await this.drizzle.db().query.news.findMany({
        limit: 4,
        where: (f, o) => o.and(
            o.not(o.eq(f.id, res.id!)),
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
            columns: {
            news_id: false,
            content: false,
            },
        },
        },
        orderBy: (f, o) => o.desc(f.created_at),
    });

    return { ...res, relatedNews }; 
  }
}