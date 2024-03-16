import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { newsCategories } from './news_categories';

export const newsCategoriesTranslate = pgTable('news_categories_translate', {
  id: serial('id').primaryKey().notNull(),
  category_id: integer('category_id').references(() => newsCategories.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  lang: langCode('lang').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
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
