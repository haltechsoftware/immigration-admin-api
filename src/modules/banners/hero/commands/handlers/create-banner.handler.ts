import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { BannerRepository } from '../../banner.repository';
import { CreateBannerCommand } from '../impl/create-command';

@CommandHandler(CreateBannerCommand)
export class CreateBannerHandler
  implements ICommandHandler<CreateBannerCommand>
{
  constructor(
    private readonly _repository: BannerRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ input }: CreateBannerCommand): Promise<any> {
    const image = await this.fileUpload.upload(
      'banner/hero/',
      input.image.buffer,
      input.image.originalName,
    );

    await this._repository.create({
      image,
      link: input.link,
      start_time: 'fdsfs',
      end_time: format(input.end_time, DateTimeFormat.Timestamp),
      is_private: input.is_private,
      translates: [
        {
          title: input.en_title,
          lang: 'en',
          description: input.en_description,
        },
        {
          title: input.lo_title,
          lang: 'lo',
          description: input.lo_description,
        },
        {
          title: input.zh_cn_title,
          lang: 'zh_cn',
          description: input.zh_cn_description,
        },
      ],
    });

    return 'ບັນທຶກຂໍ້ມູນສຳເລັດ';
  }
}
