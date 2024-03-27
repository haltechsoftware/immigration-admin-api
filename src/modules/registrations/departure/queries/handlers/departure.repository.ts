import { personalInformation } from './../../../entities/personal_information';
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import DepartureRegisterQuery from "../impl/departure.query";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { departureRegistration, passportInformation,} from "src/modules/registrations/entities";
import { and, eq, count, isNotNull, isNull, ilike } from "drizzle-orm";

@QueryHandler(DepartureRegisterQuery)
export class DepartureRegisterHandler implements IQueryHandler<DepartureRegisterQuery> {
    constructor(private readonly drizzle: DrizzleService) {}

    async execute({ params }: any) {
        const res = await this.drizzle.db()
         .select()
         .from(departureRegistration)
         .innerJoin(passportInformation, eq(departureRegistration.passport_information_id, passportInformation.id))
         .innerJoin(personalInformation, eq(departureRegistration.personal_information_id, personalInformation.id))
         .where(and(
             ilike(personalInformation.name,  `%${params.personal_information}%`),
            params.passport_number ? eq(passportInformation.number, params.passport_number) : undefined,
            params.verified_at && params.verified_at === '1' ? isNotNull(departureRegistration.verified_at) : params.verified_at && params.verified_at === '0' ? isNull(departureRegistration.verified_at) : undefined,
            params.black_list ? eq(departureRegistration.black_list, params.black_list) : undefined,
            params.verification_code ? eq(departureRegistration.verification_code, params.verification_code) : undefined 

         ));

        const total = await this.drizzle.db()
         .select({ value: count() })
         .from(departureRegistration)
         .innerJoin(passportInformation, eq(departureRegistration.passport_information_id, passportInformation.id))
         .innerJoin(personalInformation, eq(departureRegistration.personal_information_id, personalInformation.id))
         .where(and(
             ilike(personalInformation.name,  `%${params.personal_information}%`),
             params.passport_number ? eq(passportInformation.number, params.passport_number) : undefined,
             params.verified_at && params.verified_at === '1' ? isNotNull(departureRegistration.verified_at) : params.verified_at && params.verified_at === '0' ? isNull(departureRegistration.verified_at) : undefined,
             params.black_list ? eq(departureRegistration.black_list, params.black_list) : undefined,
             params.verification_code ? eq(departureRegistration.verification_code, params.verification_code) : undefined 

        ));

        return {
        data: res.map((val) => ({
            ...val.departure_registration,
            passport_information: val.passport_information, 
            personal_information: val.personal_information 
            })),
            
            total: total[0].value,
        };
    }
}
