import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import ScanArrivalCodeCommand from '../impl/scan-arrival-code.command';
import { validateCheckInDate } from 'src/common/utils/check-date.util';
import {
  DateTimeFormat,
  TypeCheckDate,
} from 'src/common/enum/date-time-fomat.enum';
import { format } from 'date-fns';

@CommandHandler(ScanArrivalCodeCommand)
export class ScanArrivalCodeHandler
  implements ICommandHandler<ScanArrivalCodeCommand>
{
  constructor(public readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.arrivalRegistration.findFirst({
      where: (fields, { eq }) =>
        eq(fields.verification_code, sql.placeholder('verification_code')),
      columns: {
        personal_information_id: false,
        passport_information_id: false,
        visa_information_id: false,
        country_id: false,
      },
    })
    .prepare();

  async execute({
    input: { verification_code },
  }: ScanArrivalCodeCommand): Promise<any> {
    const res = await this.prepared.execute({
      verification_code,
    });

    if (!res) throw new NotFoundException({ message: 'ລະຫັດບໍ່ມີໃນລະບົບ' });

    validateCheckInDate(res.check_in_date, TypeCheckDate.SCAN);

    const formatted = {
      ...res,
      check_in_date: res.check_in_date
        ? format(res.check_in_date, DateTimeFormat.date)
        : null,
    };

    return formatted;
  }
}
