import { relations } from 'drizzle-orm';
import {
  date,
  mysqlEnum,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';
import { arrivalRegistration } from './arrival_registration';
import { departureRegistration } from './departure_registration';

export const genderPersonalInfo = mysqlEnum('gender', ['female', 'male']);

export const personalInformation = mysqlTable('personal_information', {
  id: serial('id').primaryKey().notNull(),
  family_name: varchar('family_name', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  gender: genderPersonalInfo.notNull(),
  date_of_birth: date('date_of_birth', { mode: 'string' }).notNull(),
  place_of_birth: varchar('place_of_birth', { length: 255 }).notNull(),
  nationality: varchar('nationality', { length: 255 }).notNull(),
  occupation: varchar('occupation', { length: 255 }).notNull(),
  race: varchar('race', { length: 255 }).notNull(),
  phone_number: varchar('phone_number', { length: 255 }).notNull(),
});

export const personalInformationRelations = relations(
  personalInformation,
  ({ one }) => ({
    arrival_registrations: one(arrivalRegistration, {
      fields: [personalInformation.id],
      references: [arrivalRegistration.personal_information_id],
    }),
    departure_registrations: one(departureRegistration, {
      fields: [personalInformation.id],
      references: [departureRegistration.personal_information_id],
    }),
  }),
);
