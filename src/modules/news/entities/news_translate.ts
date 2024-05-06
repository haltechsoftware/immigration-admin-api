import { relations } from 'drizzle-orm';
import {
  bigint,
  json,
  mysqlTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { news } from './news';

export const newsTranslate = mysqlTable('news_translate', {
  id: serial('id').primaryKey().notNull(),
  news_id: bigint('news_id', { mode: 'number', unsigned: true }).references(
    () => news.id,
    { onDelete: 'cascade' },
  ),
  title: varchar('title', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  content: json('content'),
  lang: langCode.notNull(),
});

export const newsTranslateRelations = relations(newsTranslate, ({ one }) => ({
  news: one(news, {
    fields: [newsTranslate.news_id],
    references: [news.id],
  }),
}));
