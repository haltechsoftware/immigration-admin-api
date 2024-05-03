import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { arrivalRegistration } from '../entities';

@Injectable()
export class ArrivalRegistrationRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async getPassport(number: string) {
    return await this.drizzle.db().query.passportInformation.findFirst({
      where: (fields, operators) => operators.eq(fields.number, number),
    });
  }

  async getVisa(number: string) {
    return await this.drizzle.db().query.visaInformation.findFirst({
      where: (fields, operators) => operators.eq(fields.number, number),
    });
  }

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
        updated_at: format(new Date(), DateTimeFormat.Timestamp),
      })
      .where(eq(arrivalRegistration.id, id))
      .execute();
  }
}
