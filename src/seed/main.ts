import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import provinceSeed from './provinces/province-seed';
import provinceTranslateSeed from './provinces/province-translate-seed';
import defaultUserSeed from './user/default-user.seed';
import permissionSeed from './user/permission.seed';
import roleSeed from './user/role.seed';

// 0 -const client = mysql.createPool(process.env.DB_URL);
const client = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
});

export const db = drizzle(client);

const main = async () => {
  console.log('Seed start');
  await permissionSeed();
  await roleSeed();
  await defaultUserSeed();
  await provinceSeed();
  await provinceTranslateSeed();
  console.log('Seed done');

  await client.end();
};

main();
