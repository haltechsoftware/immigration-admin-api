import { relations } from 'drizzle-orm';
import { bigint, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { newsCategories } from './news_categories';

export const newsCategoriesTranslate = mysqlTable('news_categories_translate', {
  id: serial('id').primaryKey().notNull(),
  category_id: bigint('category_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => newsCategories.id, {
    onDelete: 'cascade',
  }),
  lang: langCode.notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
});

export const newsCategoriesTranslateRelations = relations(
  newsCategoriesTranslate,
  ({ one }) => ({
    news_category: one(newsCategories, {
      fields: [newsCategoriesTranslate.category_id],
      references: [newsCategories.id],
    }),
  }),
);

export type NewsCategoriesTranslate = typeof newsCategoriesTranslate.$inferSelect;
export type InsertNewsCategoriesTranslate = typeof newsCategoriesTranslate.$inferInsert;