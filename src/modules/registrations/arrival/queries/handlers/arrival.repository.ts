import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  arrivalRegistration,
  passportInformation,
  visaInformation,
} from 'src/modules/registrations/entities';
import {
  and,
  eq,
  count,
  ilike,
  isNotNull,
  isNull,
  SQL,
  desc,
} from 'drizzle-orm';
import ArrivalRegisterQuery from '../impl/arrival.query';
import { QueryArrivalDtoType } from '../../dto/query-arrival.dto';

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
        ...val.arrival_registration,
        passport_information: val.passport_information,
        visa_information: val.visa_information,
      })),
      total: total[0].value,
    };
  }

  buildWhereConditions({
    entry_name,
    passport_number,
    visa_number,
    verified_at,
    black_list,
    verification_code,
  }: QueryArrivalDtoType): SQL<unknown> {
    const conditions = [
      ilike(arrivalRegistration.entry_name, `%${entry_name || ''}%`),
      passport_number
        ? eq(passportInformation.number, passport_number)
        : undefined,
      visa_number ? eq(visaInformation.number, visa_number) : undefined,
      verified_at && verified_at === '1'
        ? isNotNull(arrivalRegistration.verified_at)
        : verified_at && verified_at === '0'
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
      .innerJoin(
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
