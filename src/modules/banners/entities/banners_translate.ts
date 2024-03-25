import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { banners } from './banners';

export const langCode = pgEnum('lang_code', ['en', 'lo', 'zh_cn']);

export const bannersTranslate = pgTable('banners_translate', {
  id: serial('id').primaryKey().notNull(),
  banner_id: integer('banner_id').references(() => banners.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  lang: langCode('lang').notNull(),
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
export type InsertbannersTranslate = typeof bannersTranslate.$inferInsert;
