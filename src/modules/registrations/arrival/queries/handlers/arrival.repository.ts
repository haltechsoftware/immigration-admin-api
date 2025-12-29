import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  and,
  count,
  desc,
  eq,
  isNotNull,
  isNull,
  or,
  sql,
  SQL,
  SQLWrapper,
} from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  arrivalRegistration,
  passportInformation,
  personalInformation,
  visaInformation,
} from 'src/modules/registrations/entities';
import { QueryArrivalDtoType } from '../../dto/query-arrival.dto';
import ArrivalRegisterQuery from '../impl/arrival.query';
import { profiles, users } from 'src/modules/users/entities';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { format } from 'date-fns';
import {
  nationality,
  nationalityTranslate,
} from 'src/modules/nationality/entities';
import { countries, countryTranslate } from 'src/modules/checkpoints/entities';

@QueryHandler(ArrivalRegisterQuery)
export class ArrivalRegisterHandler
  implements IQueryHandler<ArrivalRegisterQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ query }: ArrivalRegisterQuery) {
    const whereConditions = this.buildWhereConditions(query);

    const res = await this.retrieveData(
      whereConditions,
      query.offset,
      query.limit,
    );
    const total = await this.retrieveTotalCount(whereConditions);

    return {
      data: res.map((val) => ({
        id: val.arrival_registration.id,
        entry_name: val.arrival_registration.entry_name,
        black_list: val.arrival_registration.black_list,
        verification_code: val.arrival_registration.verification_code,
        verified_at: val.arrival_registration.verified_at,
        verified_by: val.arrival_registration.verified_by,
        arrival_registration_type:
          val.arrival_registration.arrival_registration_type,
        check_in_date: val.arrival_registration.check_in_date
          ? format(val.arrival_registration.check_in_date, DateTimeFormat.date)
          : null,
        created_at: val.arrival_registration.created_at,
        passport_information: {
          id: val.passport_information.id,
          number: val.passport_information.number,
        },
        visa_information: val.visa_information
          ? {
              id: val.visa_information.id,
              number: val.visa_information.number,
            }
          : undefined,
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
    entry_name,
    passport_number,
    visa_number,
    is_verified,
    black_list,
    verification_code,
    search,
    check_in_date,
  }: QueryArrivalDtoType): SQL<unknown> {
    const conditions: SQLWrapper[] = [
      // Search across multiple fields with OR logic
      search
        ? or(
            sql`${nationalityTranslate.name} LIKE ${`%${search}%`}`,
            sql`${nationalityTranslate.short_name} LIKE ${`%${search}%`}`,
            sql`${arrivalRegistration.traveling_by_type} = ${search}`,
            sql`${countryTranslate.name} LIKE ${`%${search}%`}`,
            sql`${countryTranslate.slug} LIKE ${`%${search}%`}`,
            sql`${arrivalRegistration.entry_name} LIKE ${`%${search}%`}`,
            sql`${arrivalRegistration.verification_code} LIKE ${`%${search}%`}`,
            sql`${personalInformation.name} LIKE ${`%${search}%`}`,
            sql`${personalInformation.phone_number} LIKE ${`%${search}%`}`,
          )
        : undefined,
      entry_name
        ? sql`${arrivalRegistration.entry_name} LIKE ${`%${entry_name}%`}`
        : undefined,
      passport_number
        ? eq(passportInformation.number, passport_number)
        : undefined,
      visa_number ? eq(visaInformation.number, visa_number) : undefined,
      is_verified && is_verified === 'verified'
        ? isNotNull(arrivalRegistration.verified_at)
        : is_verified && is_verified === 'no_verified'
        ? isNull(arrivalRegistration.verified_at)
        : undefined,
      black_list ? eq(arrivalRegistration.black_list, black_list) : undefined,
      verification_code
        ? eq(arrivalRegistration.verification_code, verification_code)
        : undefined,
      check_in_date
        ? sql`${arrivalRegistration.check_in_date} = DATE(${check_in_date})`
        : undefined,
    ];

    return and(...conditions.filter((condition) => condition !== undefined));
  }

  async retrieveData(
    whereConditions: SQL<unknown>,
    offset?: number,
    limit?: number,
  ) {
    return await this.drizzle
      .db()
      .select()
      .from(arrivalRegistration)
      .innerJoin(
        passportInformation,
        eq(arrivalRegistration.passport_information_id, passportInformation.id),
      )
      .innerJoin(
        personalInformation,
        eq(arrivalRegistration.personal_information_id, personalInformation.id),
      )
      .leftJoin(
        visaInformation,
        eq(arrivalRegistration.visa_information_id, visaInformation.id),
      )
      .leftJoin(
        nationality,
        eq(personalInformation.nationality_id, nationality.id),
      )
      .leftJoin(
        nationalityTranslate,
        and(
          eq(nationalityTranslate.nationality_id, nationality.id),
          eq(nationalityTranslate.lang, 'en'),
        ),
      )
      .leftJoin(countries, eq(arrivalRegistration.country_id, countries.id))
      .leftJoin(
        countryTranslate,
        and(
          eq(countries.id, countryTranslate.country_id),
          eq(countryTranslate.lang, 'en'),
        ),
      )
      .leftJoin(users, eq(arrivalRegistration.verified_by, users.id))
      .leftJoin(profiles, eq(users.id, profiles.user_id))
      .orderBy(desc(arrivalRegistration.id))
      .offset(offset)
      .limit(limit)
      .where(whereConditions);
  }

  async retrieveTotalCount(whereConditions: SQL<unknown>) {
    return await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .innerJoin(
        passportInformation,
        eq(arrivalRegistration.passport_information_id, passportInformation.id),
      )
      .innerJoin(
        personalInformation,
        eq(arrivalRegistration.personal_information_id, personalInformation.id),
      )
      .leftJoin(
        visaInformation,
        eq(arrivalRegistration.visa_information_id, visaInformation.id),
      )
      .leftJoin(
        nationality,
        eq(personalInformation.nationality_id, nationality.id),
      )
      .leftJoin(
        nationalityTranslate,
        and(
          eq(nationalityTranslate.nationality_id, nationality.id),
          eq(nationalityTranslate.lang, 'en'),
        ),
      )
      .leftJoin(countries, eq(arrivalRegistration.country_id, countries.id))
      .leftJoin(
        countryTranslate,
        and(
          eq(countries.id, countryTranslate.country_id),
          eq(countryTranslate.lang, 'en'),
        ),
      )
      .leftJoin(users, eq(arrivalRegistration.verified_by, users.id))
      .leftJoin(profiles, eq(users.id, profiles.user_id))
      .where(whereConditions);
  }
}
