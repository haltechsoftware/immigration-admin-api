import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { accommodationRequestTranslate } from './accommodation_request_translate';

export const accommodationRequest = pgTable('accommodation_request', {
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
