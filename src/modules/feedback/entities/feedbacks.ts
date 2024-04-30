import {
  boolean,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const feedbacks = mysqlTable('feedbacks', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }),
  tel: varchar('tel', { length: 100 }),
  email: varchar('email', { length: 100 }),
  message: text('message'),
  media: text('media'),
  is_published: boolean('is_published'),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;
