import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { arrivalRegistration } from '../entities';
import { eq } from 'drizzle-orm';

@Injectable()
export class ArrivalRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async updateVerifycode({
    id,
    verified_at,
  }: {
    id: number;
    verified_at: string;
  }): Promise<void> {
    await this.drizzle
      .db()
      .update(arrivalRegistration)
      .set({
        verified_at: verified_at,
      })
      .where(eq(arrivalRegistration.id, id))
      .execute();
  }
}
