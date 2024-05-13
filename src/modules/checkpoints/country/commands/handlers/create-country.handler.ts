import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { CountryRepository } from '../../country.repository';
import { CreateCountryCommand } from '../impl/create-country.command';

@CommandHandler(CreateCountryCommand)
export class CreateCountryHandler
  implements ICommandHandler<CreateCountryCommand>
{
  constructor(
    private readonly countryRepository: CountryRepository,
    private readonly drizzle: DrizzleService,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ input }: CreateCountryCommand): Promise<any> {
    if (
      input.lo.name === input.en.name ||
      input.zh_cn.name === input.en.name ||
      input.zh_cn.name === input.lo.name
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    const conflict = await this.drizzle.db().query.countryTranslate.findMany({
      where: (f, o) =>
        o.inArray(f.name, [input.lo.name, input.en.name, input.zh_cn.name]),
    });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    let image: string | undefined;

    if (input.image) {
      image = await this.fileUpload.upload(
        'country/image/',
        input.image.buffer,
        input.image.originalName,
      );
    }

    await this.countryRepository.create({
      image: image,
      is_except_visa: input.is_except_visa,
      translates: [
        {
          name: input.lo.name,
          description: input.lo.description,
          lang: 'lo',
          slug: generateSlug(input.lo.name),
        },
        {
          name: input.en.name,
          description: input.en.description,
          lang: 'en',
          slug: generateSlug(input.en.name),
        },
        {
          name: input.zh_cn.name,
          description: input.zh_cn.description,
          lang: 'zh_cn',
          slug: generateSlug(input.zh_cn.name),
        },
      ],
    });
    return 'ເພີ່ມຂໍ້ມູນສຳເລັດ';
  }
}
