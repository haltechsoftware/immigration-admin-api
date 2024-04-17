import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { checkpointCategories } from './checkpoint_categories';
import { checkpointTranslate } from './checkpoint_translate';
import { countries } from './countries';
import { provinces } from './provinces';

export const checkpoints = pgTable('checkpoints', {
  id: serial('id').primaryKey().notNull(),
  category_id: integer('category_id').references(
    () => checkpointCategories.id,
    {
      onDelete: 'cascade',
      onUpdate: 'no action',
    },
  ),
  country_id: integer('country_id').references(() => countries.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  province_id: integer('province_id').references(() => provinces.id, {
    onDelete: 'cascade',
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
