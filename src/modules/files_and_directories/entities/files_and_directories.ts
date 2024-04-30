import { relations } from 'drizzle-orm';
import {
  bigint,
  foreignKey,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const fileType = mysqlEnum('type', ['file', 'directory']);

export const filesAndDirectories = mysqlTable(
  'files_and_directories',
  {
    id: serial('id').primaryKey().notNull(),
    parent_id: bigint('parent_id', { mode: 'number', unsigned: true }),
    name: varchar('name', { length: 255 }),
    size: int('size'),
    type: fileType.notNull(),
    created_at: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      filesAndDirectoriesParentIdFilesAndDirectoriesIdFk: foreignKey({
        columns: [table.parent_id],
        foreignColumns: [table.id],
        name: 'files_and_directories_parent_id_files_and_directories_id_fk',
      }).onDelete('cascade'),
    };
  },
);

export const filesAndDirectoriesRelations = relations(
  filesAndDirectories,
  ({ one, many }) => ({
    directory: one(filesAndDirectories, {
      fields: [filesAndDirectories.parent_id],
      references: [filesAndDirectories.id],
      relationName: 'files_or_directories',
    }),
    files_or_directories: many(filesAndDirectories, {
      relationName: 'files_or_directories',
    }),
  }),
);

export type FileAndDirectory = typeof filesAndDirectories.$inferSelect;
export type InsertFileAndDirectory = typeof filesAndDirectories.$inferInsert;
