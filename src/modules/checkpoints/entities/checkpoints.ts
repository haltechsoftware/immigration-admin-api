import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { checkpointCategories } from './checkpoint_categories';
import { checkpointTranslate } from './checkpoint_translate';
import { countries } from './countries';
import { provinces } from './provinces';

export const checkpoints = mysqlTable('checkpoints', {
  id: serial('id').primaryKey().notNull(),
  category_id: bigint('category_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => checkpointCategories.id, {
    onDelete: 'set null',
  }),
  country_id: bigint('country_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => countries.id, {
    onDelete: 'set null',
    onUpdate: 'no action',
  }),
  province_id: bigint('province_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => provinces.id, {
    onDelete: 'set null',
    onUpdate: 'no action',
  }),
  image: text('image').notNull(),
  link_map: text('link_map').notNull(),
  phone_number: varchar('phone_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const checkpointRelations = relations(checkpoints, ({ one, many }) => ({
  category: one(checkpointCategories, {
    fields: [checkpoints.category_id],
    references: [checkpointCategories.id],
  }),
  country: one(countries, {
    fields: [checkpoints.country_id],
    references: [countries.id],
  }),
  province: one(provinces, {
    fields: [checkpoints.province_id],
    references: [provinces.id],
  }),
  translates: many(checkpointTranslate),
}));

export type CheckPointType = typeof checkpoints.$inferSelect;
export type InsertCheckPoints = typeof checkpoints.$inferInsert;