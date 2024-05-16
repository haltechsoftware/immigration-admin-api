import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import provinceTranslateSeed from './provinces/province-translate-seed';

const client = mysql.createPool(process.env.DB_URL);

export const db = drizzle(client);

const main = async () => {
  console.log('Seed start');
  // await permissionSeed();
  // await roleSeed();
  // await defaultUserSeed();
  // await provinceSeed();
  await provinceTranslateSeed();
  console.log('Seed done');

  await client.end();
};

main();
