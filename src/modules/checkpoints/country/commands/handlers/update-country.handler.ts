import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import generateSlug from 'src/common/utils/generate-slug';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { CountryRepository } from '../../country.repository';
import { UpdateCountryCommand } from '../impl/update-country.command';

@CommandHandler(UpdateCountryCommand)
export class UpdateCountryHandler
  implements ICommandHandler<UpdateCountryCommand>
{
  constructor(
    private readonly countryRepository: CountryRepository,
    private readonly drizzle: DrizzleService,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}
  async execute({ input, id }: UpdateCountryCommand): Promise<any> {
    const country = await this.countryRepository.findOne(id);

    if (!country)
      throw new NotFoundException({ message: 'ປະເທດນີ້ບໍ່ມີໃນລະບົບ' });

    const conflict = await this.drizzle.db().query.countryTranslate.findMany({
      where: (f, o) =>
        o.or(
          o.and(o.not(o.eq(f.id, input.lo.id)), o.eq(f.name, input.lo.name)),
          o.and(o.not(o.eq(f.id, input.en.id)), o.eq(f.name, input.en.name)),
          o.and(
            o.not(o.eq(f.id, input.zh_cn.id)),
            o.eq(f.name, input.zh_cn.name),
          ),
        ),
    });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    let image: string | undefined;

    if (input.image) {
      await this.fileUpload.remove(country.image);
      image = await this.fileUpload.upload(
        'country/image',
        input.image.buffer,
        input.image.originalName,
      );
    }

    await this.countryRepository.update({
      id: country.id,
      image: image,
      is_except_visa: input.is_except_visa,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.lo.id,
          name: input.lo.name,
          description: input.lo.description,
          lang: 'lo',
          slug: generateSlug(input.lo.name),
        },
        {
          id: input.en.id,
          name: input.en.name,
          description: input.en.description,
          lang: 'en',
          slug: generateSlug(input.en.name),
        },

        {
          id: input.zh_cn.id,
          name: input.zh_cn.name,
          description: input.zh_cn.description,
          lang: 'zh_cn',
          slug: generateSlug(input.zh_cn.name),
        },
      ],
    });

    return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
  }
}
