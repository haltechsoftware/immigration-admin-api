import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { hotels } from 'src/modules/hotels/entities';
import { profiles } from './profiles';
import { sessions } from './sessions';
import { usersToRoles } from './users_to_roles';
import {
  arrivalRegistration,
  departureRegistration,
} from 'src/modules/registrations/entities';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey().notNull(),
  hotel_id: bigint('hotel_id', { mode: 'number', unsigned: true }).references(
    () => hotels.id,
    { onDelete: 'cascade' },
  ),
  email: varchar('email', { length: 100 }).notNull(),
  password: text('password').notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [users.hotel_id],
    references: [hotels.id],
  }),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.user_id],
  }),
  sessions: many(sessions),
  usersToRoles: many(usersToRoles),
  verified_arrival_registrations: many(arrivalRegistration),
  verified_departure_registrations: many(departureRegistration),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
