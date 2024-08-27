import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertService,
  InsertServiceTranslate,
  services,
  serviceTranslate,
} from '../entities';

export type InsertServiceType = InsertService & {
  translates: InsertServiceTranslate[];
};

export type UpdateService = InsertServiceType;

@Injectable()
export class ServiceRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(data: InsertServiceType) {
    await this._drizzle.db().transaction(async (tx) => {
      const service = await tx.insert(services).values({});

      await tx.insert(serviceTranslate).values(
        data.translates.map((val) => ({
          service_id: service[0].insertId,
          lang: val.lang,
          title: val.title,
          description: val.description,
          content: val.content,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.services.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateService): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(services)
        .set({
          updated_at: input.updated_at,
        })
        .where(eq(services.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(serviceTranslate)
          .set({
            title: val.title,
            description: val.description,
            content: val.content,
          })
          .where(eq(serviceTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(services).where(eq(services.id, id));
  }
}
