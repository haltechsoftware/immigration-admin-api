import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetFeedbackByIdQuery from '../impl/get-feedback-by-id.query';

@QueryHandler(GetFeedbackByIdQuery)
export class GetFeedbackByIdHandler
  implements IQueryHandler<GetFeedbackByIdQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.feedbacks.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare();

  async execute({ id }: GetFeedbackByIdQuery): Promise<any> {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ຄຳຕິຊົມບໍ່ມີໃນລະບົບ' });

    return res;
  }
}
