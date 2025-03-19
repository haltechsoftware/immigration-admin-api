import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/modules/**/entities/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  },
} satisfies Config;
