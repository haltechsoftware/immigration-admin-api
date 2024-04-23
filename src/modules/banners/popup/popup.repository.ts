import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertBannerPopup, bannerPopups } from '../entities';

@Injectable()
export class PopupRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(input: InsertBannerPopup): Promise<void> {
    await this.drizzle
      .db()
      .insert(bannerPopups)
      .values({
        image: input.image,
        link: input.link,
        is_private: input.is_private,
        start_time: input.start_time,
        end_time: input.end_time,
      })
      .returning();
  }

  private _getByIdPrepared = this.drizzle
    .db()
    .query.bannerPopups.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare('get_popup_by_id');
  async getById(id: number) {
    return await this._getByIdPrepared.execute({ id });
  }

  async update(input: InsertBannerPopup): Promise<void> {
    await this.drizzle
      .db()
      .update(bannerPopups)
      .set({
        image: input.image,
        link: input.link,
        is_private: input.is_private,
        start_time: input.start_time,
        end_time: input.end_time,
        updated_at: input.updated_at,
      })
      .where(eq(bannerPopups.id, input.id));
  }

  async remove(id: number): Promise<void> {
    await this.drizzle.db().delete(bannerPopups).where(eq(bannerPopups.id, id));
  }

  async updatePrivate(input: {
    id: number;
    is_private?: boolean;
  }): Promise<void> {
    await this.drizzle
      .db()
      .update(bannerPopups)
      .set({
        is_private: input.is_private,
      })
      .where(eq(bannerPopups.id, input.id));
  }
}
