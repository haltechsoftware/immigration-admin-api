import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { CountryRepository } from '../../country.repository';
import { DeleteCountryCommand } from '../impl/delete-country.command';

@CommandHandler(DeleteCountryCommand)
export class DeleteCountryHandler
  implements ICommandHandler<DeleteCountryCommand>
{
  constructor(
    private readonly countryRepository: CountryRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ id }: DeleteCountryCommand): Promise<any> {
    const country = await this.countryRepository.findOne(id);

    if (!country)
      throw new NotFoundException({ message: 'ປະເທດນີ້ບໍ່ມີໃນລະບົບ' });

    if (country.image) {
      await this.fileUpload.remove(country.image);
    }

    await this.countryRepository.remove(country.id);

    return 'ລົບຂໍ້ມູນສຳເລັດ';
  }
}
