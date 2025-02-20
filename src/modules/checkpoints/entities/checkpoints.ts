import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { checkpointCategories } from './checkpoint_categories';
import { checkpointTranslate } from './checkpoint_translate';
import { country } from './province_country';
import { provinces } from './provinces';

export const checkpoints = mysqlTable('checkpoints', {
  id: serial('id').primaryKey().notNull(),
  category_id: bigint('category_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => checkpointCategories.id, {
    onDelete: 'set null',
  }),
  province_id: bigint('province_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => provinces.id, {
    onDelete: 'set null',
    onUpdate: 'no action',
  }),
  country: country,
  image: text('image'),
  link_map: text('link_map').notNull(),
  phone_number: varchar('phone_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
  visa: boolean('visa').notNull(),
  e_visa: boolean('e_visa').notNull(),
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
  province: one(provinces, {
    fields: [checkpoints.province_id],
    references: [provinces.id],
  }),
  translates: many(checkpointTranslate),
}));

export type CheckPointType = typeof checkpoints.$inferSelect;
export type InsertCheckPoints = typeof checkpoints.$inferInsert;
