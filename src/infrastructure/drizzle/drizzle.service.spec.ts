import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { sql } from 'drizzle-orm';
import { DrizzleService } from './drizzle.service';

describe('DrizzleService', () => {
  let service: DrizzleService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [DrizzleService],
    }).compile();

    service = moduleRef.get<DrizzleService>(DrizzleService);
  });

  describe('db', () => {
    it('should connect to the Postgres database', async () => {
      const result = await service.db().execute(sql`SELECT 1 + 1 AS sum`);
      expect(result[0].sum).toBe(2);
    });
  });
});
