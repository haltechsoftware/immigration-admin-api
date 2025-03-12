import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { visaCategories } from 'src/modules/visa/entities';
import GetVisaCategoryClientQuery from '../impl/get-visa_category-client.query';

@QueryHandler(GetVisaCategoryClientQuery)
export class GetVisaCategoryClientHandler
  implements IQueryHandler<GetVisaCategoryClientQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(visaCategories)
    .prepare();

  async execute({ filter: { lang }} : GetVisaCategoryClientQuery) {
    const res = await this._drizzle.db().query.visaCategories.findMany({
      with: {
        translates: {
          columns: { id: true, name: true, content: true },
          where: lang
            ? (fields, { eq }) => eq(fields.lang, lang) // ✅ Explicit cast
            : undefined,
        },
      },
      orderBy: (fields, { asc }) => asc(fields.created_at),
    });

    const total = await this._prepared.execute();

    return {
      data: res.map((val) => ({
        ...val,
        lang_id: val.translates?.[0]?.id ?? null,
        name: val.translates?.[0]?.name ?? null,
        content: val.translates?.[0]?.content ?? null,
        translates: undefined,
      })),
      total: total[0]?.value ?? 0,
    };
  }
}
