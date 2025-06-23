import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import ArrivalRegistrationCommand from '../impl/arrival-registration.command';
import { ArrivalRegistrationRepository } from '../../arrival-registration.repository';
import { CountryRepository } from 'src/modules/checkpoints/country/country.repository';
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validateDate } from 'src/common/utils/validate-date';

@CommandHandler(ArrivalRegistrationCommand)
export default class ArrivalRegistrationHandler
  implements ICommandHandler<ArrivalRegistrationCommand, string>
{
  constructor(
    private readonly repository: ArrivalRegistrationRepository,
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute({ input }: ArrivalRegistrationCommand): Promise<string> {
    const isValidCountryId = /^[0-9]+$/.test(input.country_id);

    if (!isValidCountryId) {
      throw new BadRequestException(
        'Invalid country_id: must be a valid integer.',
      );
    }

    const countryId = parseInt(input.country_id);

    const country = await this.countryRepository.findOneCountry(countryId);

    if (!country) {
      throw new NotFoundException({
        message: `${countryId} ລະຫັດບໍ່ມີໃນລະບົບ`,
      });
    }

    if (input.visa?.date_of_issue)
      validateDate(input.visa.date_of_issue, 'visa.date_of_issue');
    if (input.personal_info?.date_of_birth)
      validateDate(input.personal_info.date_of_birth, 'date_of_birth');
    if (input.passport_info?.expiry_date)
      validateDate(input.passport_info.expiry_date, 'expiry_date');
    if (input.passport_info?.date_of_issue)
      validateDate(
        input.passport_info.date_of_issue,
        'passport_info.date_of_issue',
      );

    // const passports = await this.repository.getPassportAll(
    //   input.passport_info.no,
    // );

    // if (passports.length > 0) {
    //   // Loop through each passport sequentially
    //   for (const passport of passports) {
    //     // Check if the arrival registration exists and is not verified
    //     const arrival = await this.repository.findVerifiedAt(passport.id);

    //     if (arrival.verified_at == null) {
    //       throw new UnprocessableEntityException(
    //         'ການລົງທະບຽນການມາຮອດບໍ່ໄດ้ຖືກຢືນຢັນ. ກະລຸນາຢືນຢັນການມາຮອດກ່ອນ.',
    //       );
    //     }
    //   }
    // }

    return await this.repository.create({ input });
  }
}
