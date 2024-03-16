import { relations } from 'drizzle-orm';

import {
  boolean,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { hotelImages } from './hotel_images';
import { hotelTranslate } from './hotel_translate';
import { hotelsToFacilities } from './hotels_to_facilities';

export const hotels = pgTable('hotels', {
  id: serial('id').primaryKey().notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  latitude: numeric('latitude', { precision: 10, scale: 6 }).notNull(),
  longitude: numeric('longitude', { precision: 10, scale: 6 }).notNull(),
  link: varchar('link', { length: 255 }),
  phone_number: varchar('phone_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
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
  images: many(hotelImages),
  to_facilities: many(hotelsToFacilities),
}));
