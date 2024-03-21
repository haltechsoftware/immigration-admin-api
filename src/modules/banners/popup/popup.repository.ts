import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertBannerPopup, bannerPopups } from '../entities';
import { eq, sql } from 'drizzle-orm';

export type InsertPopupType = InsertBannerPopup;

export type UpdatePopupType = InsertPopupType;

// export type UpdatePopupPrivateType = Omit<InsertPopupType, "image" | "link" | "start_time" | "end_time"> & {
//   image?: string;
//   link: string;
//   start_time: number;
//   end_time: number;
// };
@Injectable()
export class PopupRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(input: InsertPopupType): Promise<void> {
    console.log(input.start_time);
    await this.drizzle.db().transaction(async (tx) => {
      await tx
        .insert(bannerPopups)
        .values({ 
          image: input.image, 
          link: input.link, 
          is_private: input.is_private, 
          start_time: input.start_time, 
          end_time: input.end_time
        })
        .returning();
    });
  }

  private _getByIdPrepared = this.drizzle
  .db()
  .query.bannerPopups.findFirst({
    where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
  })
  .prepare('get_popup_by_id');
  async getById(
    id: number,
  ): Promise<any> {
    const res = await this._getByIdPrepared.execute({ id });
    const data = res;

    return data;
  }

  async update(input: UpdatePopupType): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      await tx
      .update(bannerPopups)
      .set({
        image: input.image, 
          link: input.link, 
          is_private: input.is_private, 
          start_time: input.start_time, 
          end_time: input.end_time
      })
      .where(eq(bannerPopups.id, input.id));
    });
  }

  async remove(id: number): Promise<void> {
    await this.drizzle.db().delete(bannerPopups).where(eq(bannerPopups.id, id));
  }

  async updatePrivate(input): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      await tx
      .update(bannerPopups)
      .set({
          is_private: input.is_private, 
      })
      .where(eq(bannerPopups.id, input.id));
    });
  }
}
