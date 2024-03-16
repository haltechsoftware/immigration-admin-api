import { pgEnum } from 'drizzle-orm/pg-core';

export const blackListStatus = pgEnum('black_list_status', [
  'available',
  'unavailable',
]);
