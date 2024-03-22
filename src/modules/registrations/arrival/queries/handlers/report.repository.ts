import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import ReportRegisterQuery from '../impl/report.query';
import { arrivalRegistration, passportInformation, visaInformation } from 'src/modules/registrations/entities';
import { and, eq, param, sql, count, ilike, isNotNull, isNull } from 'drizzle-orm';


@QueryHandler(ReportRegisterQuery)
export class ReportRegisterHandler implements IQueryHandler<ReportRegisterQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ params }: any) {
    const res = await this.drizzle.db()
      .select()
      .from(arrivalRegistration)
      .innerJoin(passportInformation, eq(arrivalRegistration.passport_information_id, passportInformation.id))
      .innerJoin(visaInformation, eq(arrivalRegistration.visa_information_id, visaInformation.id))
      .where(and(
        ilike(arrivalRegistration.entry_name, `%${params.entry_name}%`),
        params.passport_number ? eq(passportInformation.number, params.passport_number) : undefined,
        params.visa_number ? eq(visaInformation.number, params.visa_number) : undefined,
        params.verified_at && params.verified_at === '1' ? isNotNull(arrivalRegistration.verified_at) : params.verified_at && params.verified_at === '0' ? isNull(arrivalRegistration.verified_at) : undefined,
        params.black_list ? eq(arrivalRegistration.black_list, params.black_list) : undefined
      ));
  
    const total = await this.drizzle.db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .innerJoin(passportInformation, eq(arrivalRegistration.passport_information_id, passportInformation.id))
      .innerJoin(visaInformation, eq(arrivalRegistration.visa_information_id, visaInformation.id))
      .where(and(
        ilike(arrivalRegistration.entry_name, `%${params.entry_name}%`),
        params.passport_number ? eq(passportInformation.number, params.passport_number) : undefined,
        params.visa_number ? eq(visaInformation.number, params.visa_number) : undefined,
        params.verified_at && params.verified_at === '1' ? isNotNull(arrivalRegistration.verified_at) : params.verified_at && params.verified_at === '0' ? isNull(arrivalRegistration.verified_at) : undefined,
        params.black_list ? eq(arrivalRegistration.black_list, params.black_list) : undefined
      ));
  
    return {
      data: res.map((val) => ({...val.arrival_registration, passport_information: val.passport_information, visa_information: val.visa_information})),
      total: total[0].value,
    };
  }  
}
