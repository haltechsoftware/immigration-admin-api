import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DepartureRepository } from '../../departure-registration.repository';
import { validateDate } from 'src/common/utils/validate-date';

import DepartureRegistrationCommand from '../impl/departure-registration.command';
import { TypeCheckDate } from 'src/common/enum/date-time-fomat.enum';
import { validateCheckInDate } from 'src/common/utils/check-date.util';
import { moveFileToPassport } from 'src/common/utils/copy-file-name.util';
import { join } from 'path';

@CommandHandler(DepartureRegistrationCommand)
export default class DepartureRegistrationHandler
  implements ICommandHandler<DepartureRegistrationCommand, string>
{
  constructor(private readonly repository: DepartureRepository) {}

  async execute({ input }: DepartureRegistrationCommand): Promise<string> {
    validateCheckInDate(input.check_in_date, TypeCheckDate.DEPARTURE);

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
    if (input.check_in_date) validateDate(input.check_in_date, 'check_in_date');

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

    // passport image
    const destinationDir = join(
      process.cwd(),
      'client',
      'document',
      'passport',
    );

    const fileName = await moveFileToPassport(
      input.passport_info.image,
      destinationDir,
    );

    const passport_path = `client/document/passport/${fileName}`;
    // end

    return await this.repository.create({ input }, passport_path);
  }
}
