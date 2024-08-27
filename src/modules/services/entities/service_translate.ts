import { relations } from 'drizzle-orm';
import {
  bigint,
  foreignKey,
  json,
  mysqlTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { services } from './services';

export const serviceTranslate = mysqlTable(
  'service_translate',
  {
    id: serial('id').primaryKey().notNull(),
    service_id: bigint('service_id', {
      mode: 'number',
      unsigned: true,
    }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    content: json('content'),
    lang: langCode.notNull(),
  },
  (table) => ({
    serviceReference: foreignKey({
      columns: [table.service_id],
      foreignColumns: [services.id],
      name: 'service_translate_id_fk',
    }).onDelete('cascade'),
  }),
);

export const serviceTranslateRelations = relations(
  serviceTranslate,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceTranslate.service_id],
      references: [services.id],
    }),
  }),
);

export type ServiceTranslate = typeof serviceTranslate.$inferSelect;
export type InsertServiceTranslate = typeof serviceTranslate.$inferInsert;
