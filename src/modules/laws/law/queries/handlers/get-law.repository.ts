import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { laws } from 'src/modules/laws/entities';
import GetLawQuery from '../impl/get-law.query';

@QueryHandler(GetLawQuery)
export class GetLawHandler implements IQueryHandler<GetLawQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .select({ value: count() })
    .from(laws)
    .prepare();

  async execute({ paginate: { offset, limit } }: GetLawQuery) {
    const res = await this.drizzle.db().query.laws.findMany({
      orderBy: ({ created_at }, { desc }) => desc(created_at),
      limit,
      offset,
    });

    const total = await this.prepared.execute();

    return {
      data: res,
      total: total[0].value,
    };
  }
}
