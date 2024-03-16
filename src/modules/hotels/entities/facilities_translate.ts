import { relations } from 'drizzle-orm';

import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { facilities } from './facilities';

export const facilitiesTranslate = pgTable('facilities_translate', {
  id: serial('id').primaryKey().notNull(),
  facility_id: integer('facility_id').references(() => facilities.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  lang: langCode('lang').notNull(),
  facility: varchar('facility', { length: 255 }).notNull(),
});

export const facilitiesTranslateRelations = relations(
  facilitiesTranslate,
  ({ one }) => ({
    facility: one(facilities, {
      fields: [facilitiesTranslate.facility_id],
      references: [facilities.id],
    }),
  }),
);
