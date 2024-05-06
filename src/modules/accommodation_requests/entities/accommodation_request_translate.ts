import { relations } from 'drizzle-orm';
import {
  bigint,
  foreignKey,
  json,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { accommodationRequest } from './accommodation_request';

export const accommodationRequestTranslate = mysqlTable(
  'accommodation_request_translate',
  {
    id: serial('id').primaryKey().notNull(),
    accommodation_request_id: bigint('accommodation_request_id', {
      mode: 'number',
      unsigned: true,
    }),
    title: varchar('title', { length: 255 }).notNull(),
    content: json('content'),
    lang: langCode.notNull(),
  },
  (table) => ({
    accommodationRequestReference: foreignKey({
      columns: [table.accommodation_request_id],
      foreignColumns: [accommodationRequest.id],
      name: 'acc_req_translate_id_fk',
    }),
  }),
);

export const accommodationRequestTranslateRelations = relations(
  accommodationRequestTranslate,
  ({ one }) => ({
    accommodation_request: one(accommodationRequest, {
      fields: [accommodationRequestTranslate.accommodation_request_id],
      references: [accommodationRequest.id],
    }),
  }),
);

export type AccommodationRequestTranslate =
  typeof accommodationRequestTranslate.$inferSelect;
export type InsertAccommodationRequestTranslate =
  typeof accommodationRequestTranslate.$inferInsert;
