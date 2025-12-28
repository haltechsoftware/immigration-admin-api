import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import ArrivalRegistrationCommand from '../impl/arrival-registration.command';
import { ArrivalRegistrationRepository } from '../../arrival-registration.repository';
import { CountryRepository } from 'src/modules/checkpoints/country/country.repository';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { validateDate } from 'src/common/utils/validate-date';
import { validateCheckInDate } from 'src/common/utils/check-date.util';
import { TypeCheckDate } from 'src/common/enum/date-time-fomat.enum';
import { join } from 'path';
import { moveFileToPassport } from 'src/common/utils/copy-file-name.util';
import { isBefore } from 'date-fns';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { generateCode } from 'src/common/utils/generate-code.util';
import { NationalityRepository } from 'src/modules/nationality/nationality.repository';

@CommandHandler(ArrivalRegistrationCommand)
export default class ArrivalRegistrationHandler
  implements ICommandHandler<ArrivalRegistrationCommand, string>
{
  constructor(
    @Inject(FILE_UPLOAD_SERVICE) private readonly upload: IFileUpload,
    private readonly repository: ArrivalRegistrationRepository,
    private readonly nationalityRepository: NationalityRepository,
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute({ input }: ArrivalRegistrationCommand): Promise<string> {
    const isValidCountryId = /^[0-9]+$/.test(input.country_id);

    if (!isValidCountryId) {
      throw new BadRequestException(
        'Invalid country_id: must be a valid integer.',
      );
    }

    const nationality = await this.nationalityRepository.findOne(
      Number(input.personal_info.nationality_id),
    );

    if (!nationality) {
      throw new NotFoundException({
        message: `ບໍ່ພົບຂໍ້ມູນສັນຊາດs`,
      });
    }

    const countryId = parseInt(input.country_id);

    const country = await this.countryRepository.findOneCountry(countryId);

    validateCheckInDate(input.check_in_date, TypeCheckDate.ARRIVAL);

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
    if (input.check_in_date) validateDate(input.check_in_date, 'check_in_date');

    if (input.intend_Address.date_range) {
      const [checkIn, checkOut] = input.intend_Address.date_range;

      if (
        checkIn &&
        checkOut &&
        !isBefore(new Date(checkIn), new Date(checkOut))
      ) {
        throw new BadRequestException('Check-in must be before check-out.');
      }
    }

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

    // people image
    // const people_fileName = await moveFileToPassport(
    //   input.passport_info.people_image,
    //   destinationDir,
    // );

    // const people_file_path = `client/document/passport/${people_fileName}`;
    // end

    // visa
    // let visa_filePath = '';
    // if (input.visa.image) {
    //   const visa_path = join(process.cwd(), 'client', 'document', 'visa');

    //   const visa_fileName = await moveFileToPassport(
    //     input.visa.image,
    //     visa_path,
    //   );

    //   visa_filePath = `client/document/visa/${visa_fileName}`;
    // }
    // end

    // Generate unique verification code
    let code: string;
    let isUnique = false;
    const maxAttempts = 100;
    let attempts = 0;

    while (!isUnique && attempts < maxAttempts) {
      code = generateCode();
      isUnique = !(await this.repository.checkVerificationCodeExists(code));
      attempts++;
    }

    if (!isUnique) {
      throw new Error(
        'Failed to generate unique verification code after multiple attempts',
      );
    }

    const res = await this.repository.create(
      { input },
      passport_path,
      code,
      // visa_filePath,
      // people_file_path,
    );

    // if (res.status === 200 || res.status === 201) {
    //   console.log('object', res);
    //   await this.remove(input);
    // }

    return res;
  }

  // async remove(input: ArrivalRegistrationDtoType): Promise<void> {
  //   const passport_image = join(
  //     process.cwd(),
  //     'client',
  //     'uploads',
  //     input.passport_info.image,
  //   );
  //   const passport_people = join(
  //     process.cwd(),
  //     'client',
  //     'uploads',
  //     input.passport_info.people_image,
  //   );

  //   if (input.visa.image) {
  //     const visa = join(process.cwd(), 'client', 'uploads', input.visa.image);
  //     await this.upload.remove(visa);
  //   }
  //   await this.upload.remove(passport_image);
  //   await this.upload.remove(passport_people);
  // }
}
