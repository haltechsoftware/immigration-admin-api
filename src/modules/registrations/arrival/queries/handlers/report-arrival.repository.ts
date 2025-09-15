import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  and,
  count,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
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
import { profiles, users } from 'src/modules/users/entities';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { format } from 'date-fns';
import ReportArrivalRegisterQuery from '../impl/report.query';
import { ReportArrivalService } from '../../report.service';
import { QueryReportArrivalDtoType } from '../../dto/query-report-arrival.dto';

@QueryHandler(ReportArrivalRegisterQuery)
export class ReportArrivalRegisterHandler
  implements IQueryHandler<ReportArrivalRegisterQuery>
{
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly _reportService: ReportArrivalService,
  ) {}

  async execute(queryObj: ReportArrivalRegisterQuery) {
    const { query, res } = queryObj;

    const whereConditions = this.buildWhereConditions(query);

    const results = await this.retrieveData(
      whereConditions,
      query.offset,
      query.limit,
    );

    const total = await this.retrieveTotalCount(whereConditions);

    const data = results.map((val) => ({
      id: val.arrival_registration.id,
      entry_name: val.arrival_registration.entry_name,
      black_list: val.arrival_registration.black_list,
      verification_code: val.arrival_registration.verification_code,
      verified_at: val.arrival_registration.verified_at,
      verified_by: val.arrival_registration.verified_by,
      traveling_by_type: val.arrival_registration.traveling_by_type,
      arrival_registration_type:
        val.arrival_registration.arrival_registration_type,
      check_in_date: val.arrival_registration.check_in_date
        ? format(val.arrival_registration.check_in_date, DateTimeFormat.date)
        : null,
      created_at: val.arrival_registration.created_at,
      personal_information: val.personal_information,
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
    }));

    // const totalCount = total[0].value;

    /** Export Excel Service */
    return await this._reportService.exportArrivalReport(
      data,
      query.start_date,
      query.end_date,
      res,
    );

    // return {
    //   data,
    //   total: totalCount,
    // };
  }

  buildWhereConditions({
    entry_name,
    passport_number,
    visa_number,
    is_verified,
    black_list,
    verification_code,
    start_date,
    end_date,
  }: QueryReportArrivalDtoType): SQL<unknown> {
    const start = start_date ? `${start_date} 00:00:00` : undefined;
    const end = end_date ? `${end_date} 23:59:59` : undefined;

    const conditions: SQLWrapper[] = [
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
      // filter ระหว่าง start_date & end_date
      start && end
        ? sql`${arrivalRegistration.created_at} BETWEEN ${start} AND ${end}`
        : start
        ? sql`${arrivalRegistration.created_at} >= ${start}`
        : end
        ? sql`${arrivalRegistration.created_at} <= ${end}`
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
        personalInformation,
        eq(arrivalRegistration.personal_information_id, personalInformation.id),
      )
      .innerJoin(
        passportInformation,
        eq(arrivalRegistration.passport_information_id, passportInformation.id),
      )
      .leftJoin(
        visaInformation,
        eq(arrivalRegistration.visa_information_id, visaInformation.id),
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
        visaInformation,
        eq(arrivalRegistration.visa_information_id, visaInformation.id),
      )
      .where(whereConditions);
  }
}
