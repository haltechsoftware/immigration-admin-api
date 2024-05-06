import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { banners } from './banners';

export const langCode = mysqlEnum('lang', ['zh_cn', 'lo', 'en']);

export const bannersTranslate = mysqlTable('banners_translate', {
  id: serial('id').primaryKey().notNull(),
  banner_id: bigint('banner_id', { mode: 'number', unsigned: true }).references(
    () => banners.id,
    {
      onDelete: 'cascade',
    },
  ),
  lang: langCode.notNull(),
  title: varchar('title', { length: 255 }),
  description: text('description'),
});

export const bannersTranslateRelations = relations(
  bannersTranslate,
  ({ one }) => ({
    banner: one(banners, {
      fields: [bannersTranslate.banner_id],
      references: [banners.id],
    }),
  }),
);

export type BannersTranslate = typeof bannersTranslate.$inferSelect;
export type InsertBannersTranslate = typeof bannersTranslate.$inferInsert;
