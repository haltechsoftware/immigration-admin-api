import { personalInformation } from './../../../entities/personal_information';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import DepartureRegisterQuery from '../impl/departure.query';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  departureRegistration,
  passportInformation,
} from 'src/modules/registrations/entities';
import { and, eq, count, isNotNull, isNull, ilike, SQL } from 'drizzle-orm';
import { QueryDepartureDtoType } from '../../dto/query-departure.dto';

@QueryHandler(DepartureRegisterQuery)
export class DepartureRegisterHandler
  implements IQueryHandler<DepartureRegisterQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ query }: DepartureRegisterQuery) {
    const whereConditions = this.buildWhereConditions(query);

    const res = await this.retrieveData(
      whereConditions,
      query.offset,
      query.limit,
    );
    const total = await this.retrieveTotalCount(whereConditions);

    return {
      data: res.map((val) => ({
        ...val.departure_registration,
        personal_information: val.personal_information,
        passport_information: val.passport_information,
      })),
      total: total[0].value,
    };
  }

  buildWhereConditions({
    personal_information,
    passport_number,
    verified_at,
    black_list,
    verification_code,
  }: QueryDepartureDtoType): SQL<unknown> {
    const condition = [
      ilike(personalInformation.name, `%${personal_information || ''}%`),
      passport_number
        ? eq(passportInformation.number, passport_number)
        : undefined,
      verified_at && verified_at === '1'
        ? isNotNull(departureRegistration.verified_at)
        : verified_at && verified_at === '0'
        ? isNull(departureRegistration.verified_at)
        : undefined,
      black_list ? eq(departureRegistration.black_list, black_list) : undefined,
      verification_code
        ? eq(departureRegistration.verification_code, verification_code)
        : undefined,
    ];

    return and(...condition.filter((condition) => condition !== undefined));
  }

  async retrieveData(
    whereConditions: SQL<unknown>,
    offset?: number,
    limit?: number,
  ) {
    return await this.drizzle
      .db()
      .select()
      .from(departureRegistration)
      .innerJoin(
        personalInformation,
        eq(
          departureRegistration.personal_information_id,
          personalInformation.id,
        ),
      )
      .innerJoin(
        passportInformation,
        eq(
          departureRegistration.passport_information_id,
          passportInformation.id,
        ),
      )
      .offset(offset)
      .limit(limit)
      .where(whereConditions);
  }

  async retrieveTotalCount(whereConditions: SQL<unknown>) {
    return await this.drizzle
      .db()
      .select({ value: count() })
      .from(departureRegistration)
      .innerJoin(
        personalInformation,
        eq(
          departureRegistration.personal_information_id,
          personalInformation.id,
        ),
      )
      .innerJoin(
        passportInformation,
        eq(
          departureRegistration.passport_information_id,
          passportInformation.id,
        ),
      )
      .where(whereConditions);
  }
}
