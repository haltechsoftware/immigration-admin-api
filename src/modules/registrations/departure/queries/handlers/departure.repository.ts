import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  and,
  count,
  desc,
  eq,
  isNotNull,
  isNull,
  sql,
  SQL,
  SQLWrapper,
} from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  departureRegistration,
  passportInformation,
} from 'src/modules/registrations/entities';
import { QueryDepartureDtoType } from '../../dto/query-departure.dto';
import DepartureRegisterQuery from '../impl/departure.query';
import { personalInformation } from './../../../entities/personal_information';
import { profiles, users } from 'src/modules/users/entities';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';

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
        id: val.departure_registration.id,
        departure_name: val.departure_registration.departure_name,
        black_list: val.departure_registration.black_list,
        verification_code: val.departure_registration.verification_code,
        verified_at: val.departure_registration.verified_at,
        verified_by: val.departure_registration.verified_by,
        check_in_date: val.departure_registration.check_in_date
          ? format(
              val.departure_registration.check_in_date,
              DateTimeFormat.date,
            )
          : null,
        created_at: val.departure_registration.created_at,
        passport_information: {
          id: val.passport_information.id,
          number: val.passport_information.number,
        },
        verified_by_user: val.users
          ? {
              id: val.users.id,
              first_name: val.profiles.first_name,
              last_name: val.profiles.last_name,
              email: val.users.email,
              image: val.profiles.image,
            }
          : null,
      })),
      total: total[0].value,
    };
  }

  buildWhereConditions({
    departure_name,
    passport_number,
    is_verified,
    black_list,
    verification_code,
  }: QueryDepartureDtoType): SQL<unknown> {
    const condition: SQLWrapper[] = [
      departure_name
        ? sql`${
            departureRegistration.departure_name
          } LIKE ${`%${departure_name}%`}`
        : undefined,
      passport_number
        ? eq(passportInformation.number, passport_number)
        : undefined,
      is_verified && is_verified === 'verified'
        ? isNotNull(departureRegistration.verified_at)
        : is_verified && is_verified === 'no_verified'
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
      .leftJoin(users, eq(departureRegistration.verified_by, users.id))
      .leftJoin(profiles, eq(users.id, profiles.user_id))
      .orderBy(desc(departureRegistration.id))
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
