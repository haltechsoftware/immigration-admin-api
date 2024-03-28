import { relations } from 'drizzle-orm';

import {
  boolean,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { hotelTranslate } from './hotel_translate';

export const hotels = pgTable('hotels', {
  id: serial('id').primaryKey().notNull(),
  latitude: numeric('latitude', { precision: 10, scale: 6 }).notNull(),
  longitude: numeric('longitude', { precision: 10, scale: 6 }).notNull(),
  image: text('image').notNull(),
  link: text('link'),
  phone_number: varchar('phone_number', { length: 50 }),
  is_published: boolean('is_published'),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const hotelsRelations = relations(hotels, ({ many }) => ({
  translates: many(hotelTranslate),
}));
