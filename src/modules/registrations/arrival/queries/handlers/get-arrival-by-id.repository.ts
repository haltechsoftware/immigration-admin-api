import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetArrivalByIdQuery from '../impl/get-arrival-by-id.query';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { format } from 'date-fns';

@QueryHandler(GetArrivalByIdQuery)
export class GetArrivalByIdHandler
  implements IQueryHandler<GetArrivalByIdQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.arrivalRegistration.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        passport_information: true,
        visa_information: true,
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
        intended_address: true,
        verified_by_user: {
          columns: { password: false },
          with: {
            profile: true,
          },
        },
      },
    })
    .prepare();

  async execute({ id }: GetArrivalByIdQuery) {
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
