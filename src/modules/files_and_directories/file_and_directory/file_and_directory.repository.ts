import { Injectable } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { InsertFileAndDirectory, filesAndDirectories } from "../entities";
export type InsertFileAndDirectoryType = Omit<InsertFileAndDirectory, 'name'> & {
  name?: string;
};
export type UpdateSize = Omit<InsertFileAndDirectory, 'name' | 'type'>;

@Injectable()
export class FileAndDirectoryRepository {
  constructor(private readonly _drizzle: DrizzleService) { }

  async create(input: InsertFileAndDirectory): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {

      const Insert = await tx
        .insert(filesAndDirectories)
        .values({
          name: input.name,
          size: input.size,
          type: input.type,
          parent_id: input.parent_id
        })
        .returning();
      return Insert
    });
  }

  private prepared = this._drizzle
    .db()
    .query.filesAndDirectories.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare('find_banner_by_id');
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async updateSize(input: UpdateSize): Promise<void> {

    await this._drizzle
      .db()
      .update(filesAndDirectories)
      .set({
        size: input.size,
        parent_id: input.parent_id,
      })
      .where(eq(filesAndDirectories.id, input.id));

  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(filesAndDirectories).where(eq(filesAndDirectories.id, id));
  }
}