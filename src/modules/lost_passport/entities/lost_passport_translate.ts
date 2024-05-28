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
import { lostPassport } from './lost_passport';

export const lostPassportTranslate = mysqlTable(
  'lost_passport_translate',
  {
    id: serial('id').primaryKey().notNull(),
    lost_passport_id: bigint('lost_passport_id', {
      mode: 'number',
      unsigned: true,
    }),
    title: varchar('title', { length: 255 }).notNull(),
    content: json('content'),
    lang: langCode.notNull(),
  },
  (table) => ({
    lostPassportReference: foreignKey({
      columns: [table.lost_passport_id],
      foreignColumns: [lostPassport.id],
      name: 'los_pa_translate_id_fk',
    }).onDelete('cascade'),
  }),
);

export const lostPassportTranslateRelations = relations(
  lostPassportTranslate,
  ({ one }) => ({
    lost_passport: one(lostPassport, {
      fields: [lostPassportTranslate.lost_passport_id],
      references: [lostPassport.id],
    }),
  }),
);

export type LostPassportTranslate = typeof lostPassportTranslate.$inferSelect;
export type InsertLostPassportTranslate =
  typeof lostPassportTranslate.$inferInsert;
