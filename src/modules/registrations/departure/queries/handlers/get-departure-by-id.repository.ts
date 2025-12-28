import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetDepartureByIdQuery from '../impl/get-departure-by-id.query';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';

@QueryHandler(GetDepartureByIdQuery)
export class GetDepartureByIdHandler
  implements IQueryHandler<GetDepartureByIdQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.departureRegistration.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        passport_information: true,
        // personal_information: true,
        personal_information: {
          with: {
            nationality: {
              with: {
                translates: {
                  where: (translates, { eq }) => eq(translates.lang, 'en'),
                },
              },
            },
          },
        },
        verified_by_user: {
          columns: { password: false },
          with: {
            profile: true,
          },
        },
      },
    })
    .prepare();

  async execute({ id }: GetDepartureByIdQuery) {
    const res = await this.prepared.execute({ id });

    if (!res)
      throw new NotFoundException({ message: 'ລາຍການລົງທະບຽນນີ້ບໍ່ມີໃນລະບົບ' });

    const formatted = {
      ...res,
      check_in_date: res.check_in_date
        ? format(res.check_in_date, DateTimeFormat.date)
        : null,
    };
    return formatted;
  }
}
