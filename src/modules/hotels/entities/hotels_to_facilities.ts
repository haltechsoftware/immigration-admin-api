import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { facilities } from './facilities';
import { hotels } from './hotels';

export const hotelsToFacilities = pgTable(
  'hotels_to_facilities',
  {
    hotel_id: integer('hotel_id').references(() => hotels.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
    facility_id: integer('facility_id').references(() => facilities.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.hotel_id, t.facility_id] }),
  }),
);

export const hotelsToFacilitiesRelations = relations(
  hotelsToFacilities,
  ({ one }) => ({
    hotel: one(hotels, {
      fields: [hotelsToFacilities.hotel_id],
      references: [hotels.id],
    }),
    role: one(facilities, {
      fields: [hotelsToFacilities.facility_id],
      references: [facilities.id],
    }),
  }),
);
