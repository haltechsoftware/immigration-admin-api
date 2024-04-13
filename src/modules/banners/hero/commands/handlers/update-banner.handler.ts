import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { BannerRepository } from '../../banner.repository';
import { UpdateBannerCommand } from '../impl/updata-command';

@CommandHandler(UpdateBannerCommand)
export class UpdateBannerHandler
  implements ICommandHandler<UpdateBannerCommand>
{
  constructor(
    private readonly _repository: BannerRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ id, input }: UpdateBannerCommand): Promise<any> {
    console.log(input);

    const banner = await this._repository.findOne(id);

    if (!banner)
      throw new NotFoundException({ message: 'ປ້າຍນີ້ບໍ່ມີໃນລະບົບ' });

    let imageUrl: string | undefined;

    if (input.image) {
      await this.fileUpload.remove(banner.image);

      imageUrl = await this.fileUpload.upload(
        'banner/hero/',
        input.image.buffer,
        input.image.originalName,
      );
    }

    await this._repository.update({
      id,
      image: imageUrl,
      link: input.link,
      start_time: format(input.start_time, DateTimeFormat.Timestamp),
      end_time: format(input.end_time, DateTimeFormat.Timestamp),
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      is_private: input.is_private,
      translates: [
        {
          id: input.lo_id,
          title: input.lo_title,
          lang: 'lo',
          description: input.lo_description,
        },
        {
          id: input.en_id,
          title: input.en_title,
          lang: 'en',
          description: input.en_description,
        },
        {
          id: input.zh_cn_id,
          title: input.zh_cn_title,
          lang: 'zh_cn',
          description: input.zh_cn_description,
        },
      ],
    });

    return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
  }
}
