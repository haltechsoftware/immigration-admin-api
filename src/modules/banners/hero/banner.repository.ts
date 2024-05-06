import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertBanners,
  InsertBannersTranslate,
  banners,
  bannersTranslate,
} from '../entities';

export type InsertBannerType = InsertBanners & {
  translates: InsertBannersTranslate[];
};

export type UpdateBannerType = Omit<InsertBannerType, 'image'> & {
  image?: string;
  updated_at?: string;
};

export type UpdatePrivate = Omit<
  InsertBannerType,
  'image' | 'link' | 'start_time' | 'end_time' | 'bannersTranslate'
>;
@Injectable()
export class BannerRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertBannerType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const banner = await tx.insert(banners).values({
        image: input.image,
        link: input.link,
        start_time: input.start_time,
        end_time: input.end_time,
        is_private: input.is_private,
        updated_at: input.updated_at,
      });

      await tx.insert(bannersTranslate).values(
        input.translates.map((val) => ({
          banner_id: banner[0].insertId,
          lang: val.lang,
          title: val.title,
          description: val.description,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.banners.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async updatePrivate(input: UpdatePrivate): Promise<void> {
    await this._drizzle
      .db()
      .update(banners)
      .set({
        is_private: input.is_private,
      })
      .where(eq(banners.id, input.id));
  }

  async update(input: UpdateBannerType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(banners)
        .set({
          image: input.image,
          link: input.link,
          start_time: input.start_time,
          end_time: input.end_time,
          is_private: input.is_private,
          updated_at: input.updated_at,
        })
        .where(eq(banners.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(bannersTranslate)
          .set({
            title: val.title,
            description: val.description,
          })
          .where(eq(bannersTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(banners).where(eq(banners.id, id));
  }
}
