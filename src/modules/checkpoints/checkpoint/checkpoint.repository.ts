import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertCheckPointTranslate,
  InsertCheckPoints,
  checkpointTranslate,
  checkpoints,
} from '../entities';

export type InsertCheckpointType = InsertCheckPoints & {
  translates: InsertCheckPointTranslate[];
};

export type UpdateCheckpointType = InsertCheckpointType;

@Injectable()
export class CheckpointRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertCheckpointType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const checkPoint = await tx.insert(checkpoints).values({
        category_id: input.category_id,
        province_id: input.province_id,
        country_id: input.country_id,
        image: input.image,
        link_map: input.link_map,
        phone_number: input.phone_number,
        email: input.email,
      });

      await tx.insert(checkpointTranslate).values(
        input.translates.map((val) => ({
          checkpoint_id: checkPoint[0].insertId,
          name: val.name,
          slug: val.slug,
          content: val.content,
          address: val.address,
          lang: val.lang,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.checkpoints.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateCheckpointType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(checkpoints)
        .set({
          category_id: input.category_id,
          province_id: input.province_id,
          country_id: input.country_id,
          image: input.image,
          link_map: input.link_map,
          phone_number: input.phone_number,
          email: input.email,
          updated_at: input.updated_at,
        })
        .where(eq(checkpoints.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(checkpointTranslate)
          .set({
            checkpoint_id: val.checkpoint_id,
            name: val.name,
            slug: val.slug,
            content: val.content,
            address: val.address,
            lang: val.lang,
          })
          .where(eq(checkpointTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(checkpoints).where(eq(checkpoints.id, id));
  }
}
