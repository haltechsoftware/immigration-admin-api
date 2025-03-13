import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/modules/**/entities/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    // uri: process.env.DB_URL,
    // uri: process.env.DB_URL || 'mysql://root:123456@localhost:3306/immigration_db_v3',
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE ,
  },
} satisfies Config;
