import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { departureRegistration } from '../entities';
import { eq } from 'drizzle-orm';

@Injectable()
export class VerifyCodeRepository {
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
      .update(departureRegistration)
      .set({
        verified_at,
      })
      .where(eq(departureRegistration.id, id))
      .execute();
  }
}
