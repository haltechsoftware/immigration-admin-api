import { relations } from 'drizzle-orm';

import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { facilitiesTranslate } from './facilities_translate';
import { hotelsToFacilities } from './hotels_to_facilities';

export const facilities = pgTable('facilities', {
  id: serial('id').primaryKey().notNull(),
  icon: text('icon'),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const facilitiesRelations = relations(facilities, ({ many }) => ({
  translates: many(facilitiesTranslate),
  to_hotels: many(hotelsToFacilities),
}));
