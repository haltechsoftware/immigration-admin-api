import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import ArrivalVerifyCodeQuery from '../impl/verify-code.query';
import { sql } from 'drizzle-orm';
import { NotFoundException } from '@nestjs/common';
import { ArrivalRepository } from '../../arriva-registration.repository';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';

@QueryHandler(ArrivalVerifyCodeQuery)
export class ArrivalVerifyCodeHandler
  implements IQueryHandler<ArrivalVerifyCodeQuery>
{
  constructor(
    private readonly repository: ArrivalRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  private prepared = this.drizzle
    .db()
    .query.arrivalRegistration.findFirst({
      where: (fields, { eq }) =>
        eq(fields.verification_code, sql.placeholder('verification_code')),
    })
    .prepare('verify-code');

  async execute({ verification_code }: ArrivalVerifyCodeQuery) {
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
