import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const laws = pgTable('laws', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  file: text('file').notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});
