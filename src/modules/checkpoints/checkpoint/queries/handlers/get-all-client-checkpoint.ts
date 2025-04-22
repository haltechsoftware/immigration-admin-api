import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, count, eq } from 'drizzle-orm/sql';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { checkpoints } from 'src/modules/checkpoints/entities';
import { GetAllCheckpointCommand } from '../impl/get-all';
import { GetAllClientCheckpointCommand } from '../impl/get-all-client-checkpoint';
@QueryHandler(GetAllClientCheckpointCommand)
export class QueryGetAllClientCheckpointHandler implements IQueryHandler<GetAllClientCheckpointCommand> {
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    query: { lang, slug, limit, offset },
  }: GetAllClientCheckpointCommand): Promise<any> {
    let category:
      | {
          category_id: number | null;
        }
      | undefined;

    if (slug) {
      category = await this._drizzle.db().query.checkpointCategoryTranslate.findFirst({
        where: (f, o) => o.eq(f.slug, slug),
        columns: {
          category_id: true,
        },
      });
    }

    const checkpointsList = await this._drizzle.db().query.checkpoints.findMany({
      columns: {
        province_id: false,
        link_map: false,
        created_at: false,
        updated_at: false,
      },
      where: category
        ? (f, o) => o.eq(f.category_id, category!.category_id!)
        : undefined,
      with: {
        translates: {
          where: lang ? (f, o) => o.eq(f.lang, lang) : undefined,
        },
        category: {
          with: {
            translates: {
              where: lang ? (f, o) => o.eq(f.lang, lang) : undefined,
            },
          },
        },
      },
      offset,
      limit,
    });

    const total = await this._drizzle.db()
    .select({ value: count() })
    .from(checkpoints)
    .where(
      category ? eq(checkpoints.category_id, category.category_id!) : undefined
    );


    const result = checkpointsList.map((checkpoint) => {
      const { category, translates, ...rest } = checkpoint;

      return {
        ...rest,
        translates: translates?.[0] ?? null,
        category_translates: category?.translates?.[0] ?? null,
      };
    });

    return {
      data: result,
      total: total[0]?.value ?? 0,
    };
  }
}
