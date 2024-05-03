import { relations } from 'drizzle-orm';
import { accommodationRequestTranslate } from './accommodation_request_translate';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const accommodationRequest = mysqlTable('accommodation_request', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const accommodationRequestRelations = relations(
  accommodationRequest,
  ({ many }) => ({
    translates: many(accommodationRequestTranslate),
  }),
);

export type AccommodationRequest = typeof accommodationRequest.$inferSelect;
export type InsertAccommodationRequest =
  typeof accommodationRequest.$inferInsert;
