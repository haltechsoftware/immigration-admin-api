import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { bannerPopups } from '../entities';
import { eq, sql } from 'drizzle-orm';


@Injectable()
export class PopupRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      await tx
        .insert(bannerPopups)
        .values({ 
          image: data.image, 
          link: data.link, 
          is_private: data.is_private, 
          start_time: data.start_time, 
          end_time: data.end_time
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

      return {...res};
  }

  async update(data): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      await tx
      .update(bannerPopups)
      .set({
        image: data.image, 
          link: data.link, 
          is_private: data.is_private, 
          start_time: data.start_time, 
          end_time: data.end_time
      })
      .where(eq(bannerPopups.id, data.id));
    });
  }

  async remove(id: number): Promise<void> {
    await this.drizzle.db().delete(bannerPopups).where(eq(bannerPopups.id, id));
  }

  async updatePrivate(data): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      await tx
      .update(bannerPopups)
      .set({
          is_private: data.is_private, 
      })
      .where(eq(bannerPopups.id, data.id));
    });
  }
}
