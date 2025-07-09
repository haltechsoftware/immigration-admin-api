import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { sql } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { ArrivalRegistrationRepository } from '../../arrival-registration.repository';
import VerifyArrivalCodeCommand from '../impl/verify-arrival-code.command';

@CommandHandler(VerifyArrivalCodeCommand)
export class VerifyArrivalCodeHandler
  implements ICommandHandler<VerifyArrivalCodeCommand>
{
  constructor(
    private readonly repository: ArrivalRegistrationRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  private prepared = this.drizzle
    .db()
    .query.arrivalRegistration.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare();

  async execute({ id, user_id }: VerifyArrivalCodeCommand) {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ລະຫັດບໍ່ມີໃນລະບົບ' });

    if (res.verified_at !== null)
      throw new NotAcceptableException({
        message: 'ບໍ່ສາມາດກວດສອບລະຫັດທີ່ກວດສອບແລ້ວໄດ້',
      });

    await this.repository.updateVerifyCode({
      id: res.id,
      verified_at: format(new Date(), DateTimeFormat.Timestamp),
      user_id,
    });

    return 'ກວດສອບສຳເລັດ';
  }
}
