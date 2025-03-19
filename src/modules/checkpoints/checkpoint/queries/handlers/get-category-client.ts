import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm/sql';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { checkpointCategories } from 'src/modules/checkpoints/entities';
import { GetAllCategoryClientCommand } from '../impl/get-category-client';

@QueryHandler(GetAllCategoryClientCommand)
export class QueryGetAllCategoryClientHandler
  implements IQueryHandler<any>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(checkpointCategories)
    .prepare();

  async execute({
    query: { lang, limit, offset },
  }: GetAllCategoryClientCommand): Promise<any> {
    // Modify the query to return the fields you need
    const res = await this._drizzle.db().query.checkpointCategories.findMany({
      with: {
        translates: {
          columns: {
            description: false,
            category_id: false,
            slug: false,
          },
          where: lang
            ? (fields, operators) => operators.eq(fields.lang, lang)
            : undefined,
        },
      },
      limit,
      offset,
    });

    // Modify the response data format
    const formattedData = res.map(item => ({
      id: item.id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      title: item.translates?.[0]?.title || '', // Assuming title is in 'translates' and falls back to an empty string if not found
      lang: item.translates?.[0]?.lang || '',   // Same assumption for lang
    }));

    const total = await this._prepared.execute();

    return {
      data: formattedData,
      total: total[0].value,
    };
  }
}
