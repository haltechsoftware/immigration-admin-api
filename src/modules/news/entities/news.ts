import { relations } from 'drizzle-orm';

import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { newsCategories } from './news_categories';
import { newsTranslate } from './news_translate';

export const newsStatus = pgEnum('news_status', [
  'draft',
  'published',
  'private',
]);

export const news = pgTable('news', {
  id: serial('id').primaryKey().notNull(),
  category_id: integer('category_id').references(() => newsCategories.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  thumbnail: text('thumbnail').notNull(),
  status: newsStatus('status').notNull(),
  public_at: timestamp('public_at', {mode: 'string'}),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const newsRelations = relations(news, ({ many, one }) => ({
  category: one(newsCategories, {
    fields: [news.category_id],
    references: [newsCategories.id],
  }),
  translates: many(newsTranslate),
}));

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;
