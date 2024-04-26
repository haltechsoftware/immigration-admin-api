import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  and,
  count,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  SQL,
  SQLWrapper,
} from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  arrivalRegistration,
  passportInformation,
  visaInformation,
} from 'src/modules/registrations/entities';
import { QueryArrivalDtoType } from '../../dto/query-arrival.dto';
import ArrivalRegisterQuery from '../impl/arrival.query';

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
  }: QueryArrivalDtoType): SQL<unknown> {
    const conditions: SQLWrapper[] = [
      entry_name
        ? ilike(arrivalRegistration.entry_name, `%${entry_name}%`)
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
      .leftJoin(
        visaInformation,
        eq(arrivalRegistration.visa_information_id, visaInformation.id),
      )
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
        visaInformation,
        eq(arrivalRegistration.visa_information_id, visaInformation.id),
      )
      .where(whereConditions);
  }
}
