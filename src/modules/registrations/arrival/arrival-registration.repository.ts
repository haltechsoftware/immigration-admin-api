import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';

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
}
