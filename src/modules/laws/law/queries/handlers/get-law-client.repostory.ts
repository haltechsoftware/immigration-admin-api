import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { laws } from 'src/modules/laws/entities';
import GetLawQuery from '../impl/get-law.query';
import GetLawClientQuery from '../impl/get-law-client.query';

@QueryHandler(GetLawClientQuery)
export class GetLawClientHandler implements IQueryHandler<GetLawClientQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .select({ value: count() })
    .from(laws)
    .prepare();

  async execute(): Promise<any> {
    const res = await this.drizzle.db().query.laws.findMany({
      orderBy: ({ created_at }, { desc }) => desc(created_at)
    });

    const total = await this.prepared.execute();

    return {
      data: res,
      total: total[0].value,
    };
  }
}
