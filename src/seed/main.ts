import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import defaultUserSeed from './user/default-user.seed';
import permissionSeed from './user/permission.seed';
import roleSeed from './user/role.seed';

const client = mysql.createPool(process.env.DB_URL);

export const db = drizzle(client);

const main = async () => {
  console.log('Seed start');
  await permissionSeed();
  await roleSeed();
  await defaultUserSeed();
  console.log('Seed done');

  await client.end();
};

main();
