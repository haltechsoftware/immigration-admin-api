import { eq, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertLaw, laws } from '../entities';

@Injectable()
export class LawRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(input: InsertLaw): Promise<void> {
    await this.drizzle
      .db()
      .insert(laws)
      .values({
        name: input.name,
        file: input.file,
      })
      .returning();
  }

  private getByIdPrepared = this.drizzle
    .db()
    .query.laws.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare('get_law_by_id');
  async getById(id: number) {
    return await this.getByIdPrepared.execute({ id });
  }

  async update(input: InsertLaw): Promise<void> {
    await this.drizzle
      .db()
      .update(laws)
      .set({
        file: input.file,
        name: input.name,
      })
      .where(eq(laws.id, input.id));
  }

  async delete(id: number): Promise<void> {
    await this.drizzle.db().delete(laws).where(eq(laws.id, id));
  }
}
