import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertFileAndDirectory, filesAndDirectories } from '../entities';
export type InsertFileAndDirectoryType = Omit<
  InsertFileAndDirectory,
  'name'
> & {
  name?: string;
};
export type UpdateSize = Omit<InsertFileAndDirectory, 'name' | 'type'>;

@Injectable()
export class FileAndDirectoryRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertFileAndDirectory): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const Insert = await tx
        .insert(filesAndDirectories)
        .values({
          name: input.name,
          size: input.size,
          type: input.type,
          parent_id: input.parent_id,
        })
        .returning();
      return Insert;
    });
  }

  private prepared = this._drizzle
    .db()
    .query.filesAndDirectories.findFirst({
      with: { files_or_directories: true },
      where: (fields, o) =>
        o.and(
          o.eq(fields.id, sql.placeholder('id')),
          o.eq(fields.type, 'directory'),
        ),
    })
    .prepare('get_directory_by_id');
  async getOneDirectory(id: number) {
    return await this.prepared.execute({ id });
  }

  private getFilePrepared = this._drizzle
    .db()
    .query.filesAndDirectories.findFirst({
      where: (fields, operators) =>
        operators.and(
          operators.eq(fields.id, sql.placeholder('id')),
          operators.eq(fields.type, 'file'),
        ),
    })
    .prepare('get_file_by_id');
  async getOneFile(id: number) {
    return await this.getFilePrepared.execute({ id });
  }

  async decrementParentSize(id: number, size: number) {
    return await this._drizzle.db().transaction(async (tx) => {
      const old = await tx.query.filesAndDirectories.findFirst({
        columns: { size: true },
        where: (fields, operators) => operators.eq(fields.id, id),
      });

      return (
        await tx
          .update(filesAndDirectories)
          .set({ size: old.size - size })
          .where(eq(filesAndDirectories.id, id))
          .returning()
      )[0];
    });
  }

  async updateParentSize(id: number, size: number) {
    return await this._drizzle.db().transaction(async (tx) => {
      const old = await tx.query.filesAndDirectories.findFirst({
        columns: { size: true },
        where: (fields, operators) => operators.eq(fields.id, id),
      });

      return (
        await tx
          .update(filesAndDirectories)
          .set({ size: old.size + size })
          .where(eq(filesAndDirectories.id, id))
          .returning()
      )[0];
    });
  }

  private preparedRemove = this._drizzle
    .db()
    .delete(filesAndDirectories)
    .where(eq(filesAndDirectories.id, sql.placeholder('id')));
  async remove(id: number): Promise<any> {
    await this.preparedRemove.execute({ id });
  }
}
