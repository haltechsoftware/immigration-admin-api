import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { arrivalRegistration } from '../entities';

@Injectable()
export class ArrivalRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async updateVerifyCode({
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
        verified_at,
      })
      .where(eq(arrivalRegistration.id, id))
      .execute();
  }
}
