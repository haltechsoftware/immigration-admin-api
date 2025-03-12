import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { feedbacks, InsertFeedback } from '../entities';

export type InsertFeedbackType = InsertFeedback;

@Injectable()
export class FeedbackRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(input: InsertFeedbackType): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      await tx.insert(feedbacks).values({
        name: input.name,
        email: input.email,
        tel: input.tel,
        message: input.message,
        is_published: false,
        media: input.media,
      });
    });
  }

  private _getByIdPrepared = this.drizzle
    .db()
    .query.feedbacks.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare();
  async getById(id: number) {
    return await this._getByIdPrepared.execute({ id });
  }

  async updateStatus(input: {
    id: number;
    is_published?: boolean;
  }): Promise<void> {
    await this.drizzle
      .db()
      .update(feedbacks)
      .set({
        is_published: input.is_published,
      })
      .where(eq(feedbacks.id, input.id));
  }

  async remove(id: number): Promise<void> {
    await this.drizzle.db().delete(feedbacks).where(eq(feedbacks.id, id));
  }
}
