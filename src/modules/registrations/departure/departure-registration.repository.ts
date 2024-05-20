import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
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
        verification_code: null,
        updated_at: format(new Date(), DateTimeFormat.Timestamp),
      })
      .where(eq(departureRegistration.id, id));
  }
}
