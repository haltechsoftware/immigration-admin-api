import { relations } from 'drizzle-orm';

import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { hotels } from './hotels';

export const hotelTranslate = pgTable('hotel_translate', {
  id: serial('id').primaryKey().notNull(),
  hotel_id: integer('hotel_id').references(() => hotels.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  lang: langCode('lang').notNull(),
  name: varchar('name', { length: 255 }),
  content: text('content'),
  address: text('address'),
});

export const hotelTranslateRelations = relations(hotelTranslate, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelTranslate.hotel_id],
    references: [hotels.id],
  }),
}));
