import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import checkCountryExceptVisaQuery from '../impl/check-country-except-visa.query';

@QueryHandler(checkCountryExceptVisaQuery)
export class checkCountryExceptVisaHandler
  implements IQueryHandler<checkCountryExceptVisaQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.countries.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id'))
    })
    .prepare();

  async execute({ id }: checkCountryExceptVisaQuery) {

    if (typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException({ message: 'ID ຕ້ອງເປັນຕົວເລກ' });
    }

    const res = await this.prepared.execute({ id });

    if (!res)
      throw new NotFoundException({ message: 'ລາຍການນີ້ບໍ່ມີໃນລະບົບ' });

    
    if (res.is_except_visa === true) {
        return { status: 'success', message: 'ບໍ່ຕ້ອງຂໍວີຊາ' };
    } else {
        return { status: 'fail', message: 'ຕ້ອງຂໍວີຊາ' };
    }
  }
}
