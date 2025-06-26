import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  departureRegistration,
  passportInformation,
  personalInformation,
} from '../entities';
import DepartureRegistrationCommand from './commands/impl/departure-registration.command';
import generateVerifyCode from 'src/common/utils/generate-verify-code';

@Injectable()
export class DepartureRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async updateVerifyCode({
    id,
    verified_at,
  }: {
    id: number;
    verified_at: string;
  }): Promise<void> {
    await this.drizzle
      .db()
      .update(departureRegistration)
      .set({
        verified_at,
        updated_at: format(new Date(), DateTimeFormat.Timestamp),
      })
      .where(eq(departureRegistration.id, id));
  }

  async getPassportAll(number: string) {
    return await this.drizzle.db().query.passportInformation.findMany({
      where: (fields, operators) => operators.eq(fields.number, number),
    });
  }

  async findVerifiedAt(id: number) {
    return await this.drizzle.db().query.departureRegistration.findFirst({
      where: (fields, operators) =>
        operators.and(
          operators.eq(fields.passport_information_id, id), // Match passport_information_id
        ),
    });
  }

  async create({ input }: DepartureRegistrationCommand): Promise<any> {
    try {
      const { passport_info, personal_info } = input;

      return await this.drizzle.db().transaction(async (tx) => {
        // Insert Personal Information
        const [personalInfoRes] = await tx.insert(personalInformation).values({
          ...personal_info,
          race: '',
          family_name: personal_info.family_name,
          date_of_birth: format(
            personal_info.date_of_birth,
            DateTimeFormat.date,
          ),
          phone_number: personal_info.phone_number,
          place_of_birth: personal_info.place_of_birth,
        });

        // Insert Passport Information
        const [passportInfoRes] = await tx.insert(passportInformation).values({
          number: passport_info.no,
          date_issue: format(passport_info.date_of_issue, DateTimeFormat.date),
          expiry_date: format(passport_info.expiry_date, DateTimeFormat.date),
          place_issue: passport_info.place_of_issue,
          image: passport_info.image,
          people_image: '',
        });

        const code = generateVerifyCode(10);

        // Insert Departure Information
        const [departure] = await tx.insert(departureRegistration).values({
          black_list: 'available',
          departure_name: input?.departure_point || '',
          last_leaving: input?.last_leaving || '',
          personal_information_id: personalInfoRes.insertId, // ✅ Correct access to insertId
          passport_information_id: passportInfoRes.insertId, // ✅ Correct access to insertId
          verification_code: code,
        });

        // return code;

        const [personalInfo] = await tx
          .select()
          .from(personalInformation)
          .where(eq(personalInformation.id, personalInfoRes.insertId))
          .limit(1);

        const [passportInfo] = await tx
          .select()
          .from(passportInformation)
          .where(eq(passportInformation.id, passportInfoRes.insertId))
          .limit(1);

        const [departures] = await tx
          .select()
          .from(departureRegistration)
          .where(eq(departureRegistration.id, departure.insertId))
          .limit(1);

        return {
          verification_code: code,
          personal_info: personalInfo,
          passport_info: passportInfo,
          departure_registration: departures,
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to register departure');
    }
  }
}
