import { int, mysqlEnum, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';

export const timeSeriesType = mysqlEnum('time_series_type', [
  'tourists-enter',
  'tourists-exit',
  'register-enter',
  'register-exit',
  'visitor',
]);

export const timeSeries = mysqlTable('time_series', {
  timestamp: timestamp('timestamp', { mode: 'string' })
    .defaultNow()
    .primaryKey(),
  number: int('number').notNull(),
  type: timeSeriesType.notNull(),
});
