import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { feedbacks } from 'src/modules/feedback/entities';
import GetFeedbackQuery from '../impl/get-feedback.query';

@QueryHandler(GetFeedbackQuery)
export class GetFeedbackHandler implements IQueryHandler<GetFeedbackQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ query: { offset, limit, is_published } }) {
    const isPrivateCondition =
      is_published !== undefined
        ? eq(feedbacks.is_published, is_published === '1' ? true : false)
        : undefined;

    const res = await this.drizzle.db().query.feedbacks.findMany({
      orderBy: (fields, operators) => operators.desc(fields.created_at),
      where: isPrivateCondition,
      limit,
      offset,
    });

    const total = await this.drizzle
      .db()
      .select({ value: count() })
      .from(feedbacks)
      .where(isPrivateCondition);

    return {
      data: res,
      total: total[0].value,
    };
  }
}
