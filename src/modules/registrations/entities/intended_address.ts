import { relations } from 'drizzle-orm';
import { date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { arrivalRegistration } from './arrival_registration';

export const intendedAddress = pgTable('intended_address', {
  id: serial('id').primaryKey().notNull(),
  arrival_registration_id: integer('arrival_registration_id').references(
    () => arrivalRegistration.id,
    {
      onDelete: 'cascade',
      onUpdate: 'no action',
    },
  ),
  name: varchar('name', { length: 255 }).notNull(),
  province: varchar('province', { length: 255 }).notNull(),
  district: varchar('district', { length: 255 }).notNull(),
  village: varchar('village', { length: 255 }).notNull(),
  check_in: date('check_in', { mode: 'string' }).notNull(),
  check_out: date('check_out', { mode: 'string' }).notNull(),
});

export const intendedAddressRelations = relations(
  intendedAddress,
  ({ one }) => ({
    arrival_registration: one(arrivalRegistration, {
      fields: [intendedAddress.arrival_registration_id],
      references: [arrivalRegistration.id],
    }),
  }),
);
