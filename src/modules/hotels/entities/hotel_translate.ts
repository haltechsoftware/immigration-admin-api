import { relations } from 'drizzle-orm';
import { bigint, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { hotels } from './hotels';

export const hotelTranslate = mysqlTable('hotel_translate', {
  id: serial('id').primaryKey().notNull(),
  hotel_id: bigint('hotel_id', { mode: 'number', unsigned: true }).references(
    () => hotels.id,
    {
      onDelete: 'cascade',
    },
  ),
  lang: langCode.notNull(),
  name: varchar('name', { length: 255 }),
  province: varchar('province', { length: 255 }),
  district: varchar('district', { length: 255 }),
  village: varchar('village', { length: 255 }),
});

export const hotelTranslateRelations = relations(hotelTranslate, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelTranslate.hotel_id],
    references: [hotels.id],
  }),
}));

export type HotelsTranslate = typeof hotelTranslate.$inferSelect;
export type InsertHotelsTranslate = typeof hotelTranslate.$inferInsert;
