import { relations } from 'drizzle-orm';
import { integer, json, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { accommodationRequest } from './accommodation_request';

export const accommodationRequestTranslate = pgTable(
  'accommodation_request_translate',
  {
    id: serial('id').primaryKey().notNull(),
    accommodation_request_id: integer('accommodation_request_id').references(
      () => accommodationRequest.id,
      {
        onDelete: 'cascade',
        onUpdate: 'no action',
      },
    ),
    title: varchar('title', { length: 255 }).notNull(),
    content: json('content'),
    lang: langCode('lang').notNull(),
  },
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
