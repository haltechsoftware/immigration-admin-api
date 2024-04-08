import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { bannersTranslate } from './banners_translate';

export const banners = pgTable('banners', {
  id: serial('id').primaryKey().notNull(),
  image: text('image').notNull(),
  link: text('link'),
  is_private: boolean('is_private').notNull(),
  start_time: timestamp('start_time', { mode: 'string' }),
  end_time: timestamp('end_time', { mode: 'string' }),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const bannersRelations = relations(banners, ({ many }) => ({
  translates: many(bannersTranslate),
}));

export type Banners = typeof banners.$inferSelect;
export type InsertBanners = typeof banners.$inferInsert;
