import { relations } from 'drizzle-orm';
import {
  bigint,
  datetime,
  foreignKey,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';
import { hotels } from 'src/modules/hotels/entities';
import { arrivalRegistration } from './arrival_registration';

export const intendedAddress = mysqlTable(
  'intended_address',
  {
    id: serial('id').primaryKey().notNull(),
    arrival_registration_id: bigint('arrival_registration_id', {
      mode: 'number',
      unsigned: true,
    }),
    hotel_id: bigint('hotel_id', {
      mode: 'number',
      unsigned: true,
    }),
    name: varchar('name', { length: 255 }).notNull(),
    province: varchar('province', { length: 255 }).notNull(),
    district: varchar('district', { length: 255 }).notNull(),
    village: varchar('village', { length: 255 }).notNull(),
    room_no: varchar('room_no', { length: 50 }),
    check_in: datetime('check_in', { mode: 'string' }).notNull(),
    check_out: datetime('check_out', { mode: 'string' }).notNull(),
  },
  (table) => ({
    arrivalRegistrationReference: foreignKey({
      columns: [table.arrival_registration_id],
      foreignColumns: [arrivalRegistration.id],
      name: 'intended_address_arrival_reg_id_fk',
    }).onDelete('cascade'),
    hotelReference: foreignKey({
      columns: [table.hotel_id],
      foreignColumns: [hotels.id],
      name: 'intended_address_hotel_id_fk',
    }).onDelete('set null'),
  }),
);

export const intendedAddressRelations = relations(
  intendedAddress,
  ({ one }) => ({
    arrival_registration: one(arrivalRegistration, {
      fields: [intendedAddress.arrival_registration_id],
      references: [arrivalRegistration.id],
    }),
    hotel: one(hotels, {
      fields: [intendedAddress.hotel_id],
      references: [hotels.id],
    }),
  }),
);
