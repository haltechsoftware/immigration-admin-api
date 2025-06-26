import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DepartureRepository } from '../../departure-registration.repository';
import { validateDate } from 'src/common/utils/validate-date';
import {
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import DepartureRegistrationCommand from '../impl/departure-registration.command';

@CommandHandler(DepartureRegistrationCommand)
export default class DepartureRegistrationHandler
  implements ICommandHandler<DepartureRegistrationCommand, string>
{
  constructor(private readonly repository: DepartureRepository) {}

  async execute({ input }: DepartureRegistrationCommand): Promise<string> {
    // Validate dates
    if (input.personal_info?.date_of_birth)
      validateDate(input.personal_info.date_of_birth, 'date_of_birth');
    if (input.passport_info?.expiry_date)
      validateDate(input.passport_info.expiry_date, 'expiry_date');
    if (input.passport_info?.date_of_issue)
      validateDate(
        input.passport_info.date_of_issue,
        'passport_info.date_of_issue',
      );

    // Check if the passport already exists
    // const passports = await this.repository.getPassportAll(
    //   input.passport_info.no,
    // );

    // if (passports.length > 0) {
    //   // Loop through each passport sequentially to check arrival verification status
    //   for (const passport of passports) {
    //     // Check if the arrival registration exists and is not verified
    //     const arrival = await this.repository.findVerifiedAt(passport.id);

    //     if (!arrival || arrival.verified_at == null) {
    //       throw new UnprocessableEntityException(
    //         'ການລົງທະບຽນອອກບໍ່ໄດ้ຖືກຢືນຢັນ. ກະລຸນາຢືນຢັນກ່ອນ.',
    //       );
    //     }
    //   }
    // }

    return await this.repository.create({ input });
  }
}
