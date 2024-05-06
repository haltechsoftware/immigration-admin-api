import { mysqlEnum } from 'drizzle-orm/mysql-core';

export const blackListStatus = mysqlEnum('black_list', [
  'unavailable',
  'available',
]);
