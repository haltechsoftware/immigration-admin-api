import { Injectable, NotFoundException } from "@nestjs/common";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { InsertBanners, InsertbannersTranslate, banners, bannersTranslate } from "../entities";
import { eq, sql } from "drizzle-orm";

export type InsertBannerType = InsertBanners & {
  bannersTranslate: InsertbannersTranslate
};

export type UpdateBannerType = Omit<InsertBannerType, 'bannersTranslate'>;
export type UpatePrivate = Omit<InsertBannerType,
  'image' | 'link' | 'start_time' | 'end_time' | 'bannersTranslate'
>;
@Injectable()
export class BannerRepository {
  constructor(
    private readonly _drizzle: DrizzleService
  ) { }
  async create(input: InsertBanners): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const banner = await tx
        .insert(banners)
        .values({
          image: input.image,
          link: input.link,
          start_time: input.start_time,
          end_time: input.end_time,
          is_private: input.is_private,
          updated_at: input.updated_at,
        })
        .returning();

      const output = [];
      const languages = ['translate_lo', 'translate_en', 'translate_zh_cn'];

      languages.forEach(langs => {
        const langData = input[langs];
        output.push({
          banner_id: banner[0]?.id,
          lang: langData.lang,
          title: langData.title,
          description: langData.description,
        });
      });

      await tx.insert(bannersTranslate).values(output);
      return banner
    });
  }

  //start find one
  private prepared = this._drizzle
    .db()
    .query.banners.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare('find_banner_by_id');
  async findOne(id: number) {
    const res = await this.prepared.execute({ id });
    if (!res) throw new NotFoundException({ message: 'banner id is Empty' })
    return res
  }
  //end find one
  async updatePrivate(input: UpatePrivate): Promise<void> {

    await this._drizzle.db().transaction(async (tx) => {
      const banner = await tx
        .update(banners)
        .set({
          is_private: input.is_private,
        })
        .where(eq(banners.id, input.id));
      return banner
    })
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
        })
        .where(eq(banners.id, input.id));
     console.log('banner');
     
      const output = [];
      const languages = ['translate_lo', 'translate_en', 'translate_zh_cn'];

      languages.forEach(lang => {
        const langData = input[lang];
        output.push({
          banner_id: input.id,
          lang: langData.lang,
          title: langData.title,
          description: langData.description
        });
      });
      await tx.delete(bannersTranslate).where(eq(bannersTranslate.banner_id, input.id));
      await tx.insert(bannersTranslate).values(output)
      // return banner
    });
  }

  // method remove
  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(bannersTranslate).where(eq(bannersTranslate.banner_id, id))
    await this._drizzle.db().delete(banners).where(eq(banners.id, id));
  }

}