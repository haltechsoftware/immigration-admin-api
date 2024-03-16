import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import defaultUserSeed from './user/default-user.seed';
import permissionSeed from './user/permission.seed';
import roleSeed from './user/role.seed';

const client = postgres({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL ? 'require' : false,
});

export const db = drizzle(client);

const main = async () => {
  console.log('Seed start');
  await permissionSeed();
  await roleSeed();
  await defaultUserSeed();
  console.log('Seed done');

  client.end();
};

main();
