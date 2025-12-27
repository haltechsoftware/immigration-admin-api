import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';
import { nationality } from './nationality';

export const langCode = mysqlEnum('lang', ['zh_cn', 'lo', 'en']);

export const nationalityTranslate = mysqlTable('nationality_translates', {
  id: serial('id').primaryKey().notNull(),
  nationality_id: bigint('nationality_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => nationality.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  lang: langCode.notNull(),
});

export const nationalityTranslateRelations = relations(
  nationalityTranslate,
  ({ one }) => ({
    nationality: one(nationality, {
      fields: [nationalityTranslate.nationality_id],
      references: [nationality.id],
    }),
  }),
);

export type NationalityTranslate = typeof nationalityTranslate.$inferSelect;
export type InsertNationalityTranslate =
  typeof nationalityTranslate.$inferInsert;
