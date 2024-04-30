import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertHotels,
  InsertHotelsTranslate,
  hotelTranslate,
  hotels,
} from '../entities';

export type InsertHotelType = InsertHotels & {
  translates: InsertHotelsTranslate[];
};

export type UpdateHotelType = Omit<InsertHotelType, 'image'> & {
  image?: string;
};

export type UpdatePublic = Omit<
  InsertHotelType,
  | 'image'
  | 'link'
  | 'latitude'
  | 'longitude'
  | 'phone_number'
  | 'hotelTranslate'
>;

@Injectable()
export class HotelRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertHotelType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const hotel = await tx.insert(hotels).values({
        link_map: input.link_map,
        image: input.image,
        link: input.link,
        phone_number: input.phone_number,
        is_published: input.is_published,
      });

      await tx.insert(hotelTranslate).values(
        input.translates.map((val) => ({
          hotel_id: hotel[0].insertId,
          lang: val.lang,
          name: val.name,
          address: val.address,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.hotels.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateHotelType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(hotels)
        .set({
          link_map: input.link_map,
          image: input.image,
          link: input.link,
          phone_number: input.phone_number,
          is_published: input.is_published,
          updated_at: input.updated_at,
        })
        .where(eq(hotels.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(hotelTranslate)
          .set({
            name: val.name,
            address: val.address,
          })
          .where(eq(hotelTranslate.id, val.id));
      });
    });
  }

  async updatePublished(input: UpdatePublic): Promise<void> {
    await this._drizzle
      .db()
      .update(hotels)
      .set({
        is_published: input.is_published,
      })
      .where(eq(hotels.id, input.id));
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(hotels).where(eq(hotels.id, id));
  }
}