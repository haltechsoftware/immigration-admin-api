import { relations } from 'drizzle-orm';
import {
  date,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { arrivalRegistration } from './arrival_registration';
import { departureRegistration } from './departure_registration';

export const passportInformation = mysqlTable('passport_information', {
  id: serial('id').primaryKey().notNull(),
  number: varchar('number', { length: 255 }).notNull().unique(),
  expiry_date: date('expiry_date', { mode: 'string' }).notNull(),
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

export const passportInformationRelations = relations(
  passportInformation,
  ({ many }) => ({
    arrival_registrations: many(arrivalRegistration),
    departure_registrations: many(departureRegistration),
  }),
);
