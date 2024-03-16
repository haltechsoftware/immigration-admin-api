import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { news } from './news';
import { newsCategoriesTranslate } from './news_categories_translate';

export const newsCategories = pgTable('news_categories', {
  id: serial('id').primaryKey().notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const newsCategoriesRelations = relations(
  newsCategories,
  ({ many }) => ({
    translates: many(newsCategoriesTranslate),
    news: many(news),
  }),
);
