import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import IEnv from 'src/common/interface/env.interface';
import * as schema from 'src/modules/users/entities';

@Injectable()
export class DrizzleService {
  constructor(private readonly config?: ConfigService<IEnv>) {}

  private readonly client = postgres({
    host: this.config.get('DB_HOST'),
    user: this.config.get('DB_USER'),
    password: this.config.get('DB_PASSWORD'),
    database: this.config.get('DB_NAME'),
    ssl: this.config.get('DB_SSL'),
  });

  db() {
    return drizzle(this.client, { schema });
  }
}
