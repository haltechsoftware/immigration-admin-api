import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }),
  tel: varchar('tel', { length: 100 }),
  email: varchar('email', { length: 100 }),
  message: text('message'),
  media: text('media').notNull(),
  is_published: boolean('is_published'),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});
