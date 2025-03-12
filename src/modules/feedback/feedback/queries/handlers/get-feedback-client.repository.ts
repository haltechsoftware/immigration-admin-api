import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { feedbacks } from 'src/modules/feedback/entities';
import GetFeedbackClientQuery from '../impl/get-feedback-client-query';

@QueryHandler(GetFeedbackClientQuery)
export class GetFeedbackClientHandler implements IQueryHandler<GetFeedbackClientQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ query: { offset, limit } }) {
    const res = await this.drizzle.db().query.feedbacks.findMany({
      orderBy: (fields, operators) => operators.desc(fields.created_at),
      where: eq(feedbacks.is_published, true), // ✅ Use `true` instead of `1`
      limit,
      offset,
    });

    const total = await this.drizzle
      .db()
      .select({ value: count() })
      .from(feedbacks)
      .where(eq(feedbacks.is_published, true)); // ✅ Use `true` instead of `1`

    return {
      data: res,
      total: total[0]?.value || 0, // Ensure total exists
    };
  }
}
