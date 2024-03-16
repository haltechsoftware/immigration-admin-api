import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const bannerPopups = pgTable('banner_popups', {
  id: serial('id').primaryKey().notNull(),
  image: text('image').notNull(),
  link: varchar('link', { length: 255 }),
  is_private: boolean('is_private').notNull(),
  start_time: timestamp('start_time'),
  end_time: timestamp('end_time'),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});
