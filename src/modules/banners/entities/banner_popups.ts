import {
  boolean,
  mysqlTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const bannerPopups = mysqlTable('banner_popups', {
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

export type BannerPopup = typeof bannerPopups.$inferSelect;
export type InsertBannerPopup = typeof bannerPopups.$inferInsert;
