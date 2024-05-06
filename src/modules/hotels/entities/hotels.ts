import { relations } from 'drizzle-orm';
import {
  boolean,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { intendedAddress } from 'src/modules/registrations/entities';
import { users } from 'src/modules/users/entities';
import { hotelTranslate } from './hotel_translate';

export const hotels = mysqlTable('hotels', {
  id: serial('id').primaryKey().notNull(),
  link_map: text('link_map').notNull(),
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

export const hotelsRelations = relations(hotels, ({ many, one }) => ({
  translates: many(hotelTranslate),
  user: one(users, {
    fields: [hotels.id],
    references: [users.hotel_id],
  }),
  intended_address: many(intendedAddress),
}));

export type hotels = typeof hotels.$inferSelect;
export type InsertHotels = typeof hotels.$inferInsert;
