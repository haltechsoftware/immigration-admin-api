import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetNewsCategoryById } from '../impl/news-category-get-by-id';

@QueryHandler(GetNewsCategoryById)
export class GetCategoryByIdHandler
  implements IQueryHandler<GetNewsCategoryById>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.newsCategories.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();

  async execute({ id }: GetNewsCategoryById): Promise<any> {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

    return res;
  }
}
