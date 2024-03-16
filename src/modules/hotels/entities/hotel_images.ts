import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { hotels } from './hotels';

export const hotelImages = pgTable('hotel_images', {
  hotel_id: integer('hotel_id').references(() => hotels.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  url: text('url'),
});

export const hotelImageRelations = relations(hotelImages, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelImages.hotel_id],
    references: [hotels.id],
  }),
}));
