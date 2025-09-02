import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { and, eq, isNull } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  arrivalRegistration,
  intendedAddress,
  passportInformation,
  personalInformation,
  visaInformation,
} from '../entities';
import ArrivalRegistrationCommand from './commands/impl/arrival-registration.command';
import { Gender } from './dtos/personal-info.dto';
import generateVerifyCode from 'src/common/utils/generate-verify-code';
import { countries, countryTranslate } from 'src/modules/checkpoints/entities';

@Injectable()
export class ArrivalRegistrationRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async getPassport(number: string) {
    return await this.drizzle.db().query.passportInformation.findFirst({
      where: (fields, operators) => operators.eq(fields.number, number),
    });
  }

  async getPassportAll(number: string) {
    return await this.drizzle.db().query.passportInformation.findMany({
      where: (fields, operators) => operators.eq(fields.number, number),
    });
  }

  async getVisa(number: string) {
    return await this.drizzle.db().query.visaInformation.findFirst({
      where: (fields, operators) => operators.eq(fields.number, number),
    });
  }

  async updateVerifyCode({
    id,
    verified_at,
    user_id,
  }: {
    id: number;
    verified_at: string;
    user_id: number;
  }): Promise<void> {
    await this.drizzle
      .db()
      .update(arrivalRegistration)
      .set({
        verified_at,
        updated_at: format(new Date(), DateTimeFormat.Timestamp),
        verified_by: user_id,
      })
      .where(eq(arrivalRegistration.id, id))
      .execute();
  }

  async findVerifiedAt(id: number) {
    return await this.drizzle.db().query.arrivalRegistration.findFirst({
      where: (fields, operators) =>
        operators.and(
          operators.eq(fields.passport_information_id, id), // Match passport_information_id
          // operators.isNull(fields.verified_at)                    // Check if verified_at is NULL
        ),
    });
  }

  async create(
    { input }: ArrivalRegistrationCommand,
    passport_path: string,
    visa_filePath: string,
    people_file_path: string,
  ): Promise<any> {
    try {
      return await this.drizzle.db().transaction(async (tx) => {
        const { passport_info, personal_info, visa, intend_Address } = input;
        // Personal Information (Ensure column names match database schema)
        const personalInfoRes = await tx.insert(personalInformation).values({
          gender: personal_info.gender === Gender.Male ? 'male' : 'female',
          name: personal_info.name,
          nationality: personal_info.nationality,
          occupation: personal_info.occupation,
          family_name: personal_info.family_name, // ✅ Fixed
          date_of_birth: format(
            personal_info.date_of_birth,
            DateTimeFormat.date,
          ), // ✅ Fixed
          phone_number: personal_info.phone_number, // ✅ Fixed
          place_of_birth: personal_info.place_of_birth,
          race: personal_info.race,
        });

        // Passport Information
        const passportInfoRes = await tx.insert(passportInformation).values({
          number: passport_info.no,
          date_issue: format(passport_info.date_of_issue, DateTimeFormat.date), // ✅ Fixed
          expiry_date: format(passport_info.expiry_date, DateTimeFormat.date), // ✅ Fixed
          place_issue: passport_info.place_of_issue,
          image: passport_path,
          people_image: people_file_path,
        });

        // Visa Information
        let visaId: number | undefined;
        if (
          visa !== null &&
          visa.no &&
          visa.visaCategory &&
          visa.date_of_issue &&
          visa.place_of_issue
        ) {
          const visaInfoRes = await tx.insert(visaInformation).values({
            number: visa.no, // Matches the 'number' column in the DB
            visaCategory: visa.visaCategory, // Drizzle will map 'visaCategory' to 'visa_category' in the DB
            date_issue: format(visa.date_of_issue, DateTimeFormat.date),
            place_issue: visa.place_of_issue,
            image: visa_filePath, // Handles the image field correctly (null if not provided)
          });

          visaId = visaInfoRes[0].insertId; // Get the insertId from the response
        }

        const code = generateVerifyCode(10);

        // Arrival Registration
        const savedData = await tx.insert(arrivalRegistration).values({
          black_list: 'available', // ✅ Fixed (assuming database uses snake_case)
          entry_name: input.entry_point, // ✅ Fixed
          is_traveling_in_tour: input.is_travelling_in_tour, // ✅ Fixed
          purpose: input.purpose,
          traveling_by_no: input.travelling_by.no, // ✅ Fixed
          traveling_by_type: input.travelling_by.type, // ✅ Fixed
          personal_information_id: personalInfoRes[0].insertId, // ✅ Fixed
          passport_information_id: passportInfoRes[0].insertId, // ✅ Fixed
          country_id: Number(input.country_id), // ✅ Fixed
          arrival_registration_type: input.arrival_registration_type, // ✅ Fixed
          visa_information_id: visaId, // ✅ Fixed
          verification_code: code, // ✅ Fixed
          check_in_date: new Date(input.check_in_date),
        });

        // Intended Address
        await tx.insert(intendedAddress).values({
          arrival_registration_id: savedData[0].insertId, // ✅ Correct
          name: intend_Address.name, // ✅ Correct field name
          province: intend_Address.province, // ✅ Correct field name
          district: intend_Address.district, // ✅ Correct field name
          village: intend_Address.village, // ✅ Correct field name
          check_in: intend_Address.date_range?.[0]
            ? format(intend_Address.date_range[0], DateTimeFormat.date)
            : undefined,

          check_out: intend_Address.date_range?.[1]
            ? format(intend_Address.date_range[1], DateTimeFormat.date)
            : undefined,
        });

        const [country] = await tx
          .select({ ...countries, ...countryTranslate })
          .from(countries)
          .leftJoin(
            countryTranslate,
            eq(countryTranslate.country_id, countries.id),
          )
          .where(
            and(
              eq(countries.id, Number(input.country_id)),
              eq(countryTranslate.lang, 'en'),
            ),
          )
          .limit(1);

        // return code; // Return generated verification code
        return {
          verification_code: code,
          check_in_date: input.check_in_date,
          personal_info: personal_info,
          passport_info: passport_info,
          visa_info: visa || null,
          arrival_registration: {
            black_list: 'available',
            entry_name: input.entry_point,
            is_traveling_in_tour: input.is_travelling_in_tour,
            purpose: input.purpose,
            traveling_by_no: input.travelling_by.no,
            traveling_by_type: input.travelling_by.type,
            country: country,
          },
          intended_address: {
            ...intend_Address,
          },
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to register arrival.');
    }
  }
}
