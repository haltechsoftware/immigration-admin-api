import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import VerifyDepartureCodeCommand from '../impl/verify-departure-code.command';
import { VerifyCodeRepository } from '../../departure-registration.reppository';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { sql } from 'drizzle-orm';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { format } from 'date-fns';

@CommandHandler(VerifyDepartureCodeCommand)
export class VerifyDepartureCodeHandler
  implements ICommandHandler<VerifyDepartureCodeCommand>
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
    .prepare('verify-departure-code');

  async execute({ input: { verification_code } }: VerifyDepartureCodeCommand) {
    const res = await this.prepared.execute({ verification_code });

    if (!res) throw new NotFoundException({ message: 'ລະຫັດບໍ່ມີໃນລະບົບ' });

    if (res.verified_at !== null)
      throw new NotAcceptableException({
        message: 'ບໍ່ສາມາດກວດສອບລະຫັດທີ່ກວດສອບແລ້ວໄດ້',
      });

    await this.repository.updateVerifycode({
      id: res.id,
      verified_at: format(new Date(), DateTimeFormat.Timestamp),
    });

    return 'ກວດສອບສໍາເລັດ';
  }
}
