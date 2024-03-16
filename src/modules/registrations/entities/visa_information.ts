import { relations } from 'drizzle-orm';
import {
  date,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { arrivalRegistration } from './arrival_registration';

export const visaInformation = pgTable('visa_information', {
  id: serial('id').primaryKey().notNull(),
  number: varchar('number', { length: 255 }).notNull().unique(),
  date_issue: date('date_issue', { mode: 'string' }).notNull(),
  place_issue: varchar('place_issue', { length: 255 }).notNull(),
  image: text('image').notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const visaInformationRelations = relations(
  visaInformation,
  ({ many }) => ({
    arrival_registrations: many(arrivalRegistration),
  }),
);
