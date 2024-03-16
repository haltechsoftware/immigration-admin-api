import { relations } from 'drizzle-orm';
import {
  integer,
  json,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { news } from './news';

export const newsTranslate = pgTable('news_translate', {
  id: serial('id').primaryKey().notNull(),
  news_id: integer('news_id').references(() => news.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  content: json('content'),
  lang: langCode('lang').notNull(),
});

export const newsTranslateRelations = relations(newsTranslate, ({ one }) => ({
  news: one(news, {
    fields: [newsTranslate.news_id],
    references: [news.id],
  }),
}));
