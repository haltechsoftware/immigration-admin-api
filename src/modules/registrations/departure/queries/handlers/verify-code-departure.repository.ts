import { DrizzleService } from './../../../../../infrastructure/drizzle/drizzle.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import DepartureVerifyCodeQuery from '../impl/verify-code-departure.query';
import { sql } from 'drizzle-orm';
import { NotFoundException } from '@nestjs/common';
import { VerifyCodeRepository } from '../../departure-registration.reppository';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { format } from 'date-fns';

@QueryHandler(DepartureVerifyCodeQuery)
export class DepartureVerifyCodeHandler
  implements IQueryHandler<DepartureVerifyCodeQuery>
{
  constructor(
    private readonly repository: VerifyCodeRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  private prepared = this.drizzle
    .db()
    .query.departureRegistration.findFirst({
      where: (fields, { eq }) =>
        eq(fields.verification_code, sql.placeholder('verification_code')),
    })
    .prepare('verify-code-departure');

  async execute({ verification_code }: DepartureVerifyCodeQuery) {
    const res = await this.prepared.execute({ verification_code });

    if (!res) {
      throw new NotFoundException({ message: 'ລະຫັດບໍ່ມີໃນລະບົບ' });
    }
    if (res.verified_at == null) {
      await this.repository.updateVerifycode({
        id: res.id,
        verified_at: format(new Date(), DateTimeFormat.Timestamp),
      });
    }

    return res;
  }
}
