import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { departureRegistration } from '../entities';

@Injectable()
export class DepartureRepository {
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
      .update(departureRegistration)
      .set({
        verified_at,
      })
      .where(eq(departureRegistration.id, id));
  }
}
