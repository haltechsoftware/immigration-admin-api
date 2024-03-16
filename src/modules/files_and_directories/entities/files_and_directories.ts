import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const fileType = pgEnum('file_type', ['directory', 'file']);

export const filesAndDirectories = pgTable('files_and_directories', {
  id: serial('id').primaryKey().notNull(),
  parent_id: integer('parent_id').references(
    (): AnyPgColumn => filesAndDirectories.id,
    {
      onDelete: 'cascade',
      onUpdate: 'no action',
    },
  ),
  name: varchar('name', { length: 255 }),
  size: integer('size'),
  type: fileType('type').notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const filesAndDirectoriesRelations = relations(
  filesAndDirectories,
  ({ one, many }) => ({
    directory: one(filesAndDirectories, {
      fields: [filesAndDirectories.parent_id],
      references: [filesAndDirectories.id],
    }),
    files_or_directories: many(filesAndDirectories),
  }),
);
