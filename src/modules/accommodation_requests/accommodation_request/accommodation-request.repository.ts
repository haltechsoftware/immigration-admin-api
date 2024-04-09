import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertAccommodationRequest,
  InsertAccommodationRequestTranslate,
  accommodationRequest,
  accommodationRequestTranslate,
} from '../entities';

export type InsertAccommodationRequestType = InsertAccommodationRequest & {
  translates: InsertAccommodationRequestTranslate[];
};

export type UpdateAccommodationRequest = InsertAccommodationRequestType;

@Injectable()
export class AccommodationRequestRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(data: InsertAccommodationRequestType) {
    await this._drizzle.db().transaction(async (tx) => {
      const accommodation_request = await tx
        .insert(accommodationRequest)
        .values({})
        .returning();

      await tx.insert(accommodationRequestTranslate).values(
        data.translates.map((val) => ({
          accommodation_request_id: accommodation_request[0].id,
          lang: val.lang,
          title: val.title,
          content: val.content,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.accommodationRequest.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare('find_banner_by_id');
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateAccommodationRequest): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(accommodationRequest)
        .set({
          updated_at: input.updated_at,
        })
        .where(eq(accommodationRequest.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(accommodationRequestTranslate)
          .set({
            title: val.title,
            content: val.content,
          })
          .where(eq(accommodationRequestTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle
      .db()
      .delete(accommodationRequest)
      .where(eq(accommodationRequest.id, id));
  }
}
