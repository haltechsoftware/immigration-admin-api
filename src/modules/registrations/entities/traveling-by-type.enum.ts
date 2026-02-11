import { mysqlEnum } from 'drizzle-orm/mysql-core';

export const travelingByType = mysqlEnum('traveling_by_type', [
  'bus',
  'car',
  'flight',
  'waterway',
  'train',
  'other',
]);
