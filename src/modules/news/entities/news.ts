import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { newsCategories } from './news_categories';
import { newsTranslate } from './news_translate';

export const newsStatus = mysqlEnum('status', [
  'private',
  'published',
  'draft',
  'zh_cn',
  'lo',
  'en',
]);

export const news = mysqlTable('news', {
  id: serial('id').primaryKey().notNull(),
  category_id: bigint('category_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => newsCategories.id, {
    onDelete: 'cascade',
  }),
  thumbnail: text('thumbnail').notNull(),
  status: newsStatus.notNull(),
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
