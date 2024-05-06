import { relations } from 'drizzle-orm';
import {
  bigint,
  json,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { visaCategories } from './visa_categories';

export const visaCategoryTranslate = mysqlTable('visa_category_translate', {
  id: serial('id').primaryKey().notNull(),
  visa_category_id: bigint('visa_category_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => visaCategories.id, {
    onDelete: 'cascade',
  }),
  name: varchar('name', { length: 255 }).notNull(),
  content: json('content'),
  lang: langCode.notNull(),
});

export const visaCategoryTranslateRelations = relations(
  visaCategoryTranslate,
  ({ one }) => ({
    visa_category: one(visaCategories, {
      fields: [visaCategoryTranslate.visa_category_id],
      references: [visaCategories.id],
    }),
  }),
);

export type visaCategoryTranslate = typeof visaCategoryTranslate.$inferSelect;
export type InsertVisaCategoryTranslate =
  typeof visaCategoryTranslate.$inferInsert;
