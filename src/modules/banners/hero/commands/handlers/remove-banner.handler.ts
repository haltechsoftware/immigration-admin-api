import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { BannerRepository } from '../../banner.repository';
import { RemoveBannerCommand } from '../impl/remove-banner';

@CommandHandler(RemoveBannerCommand)
export class RemoveBannerHandler
  implements ICommandHandler<RemoveBannerCommand>
{
  constructor(
    private readonly repository: BannerRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}
  async execute({ id }: RemoveBannerCommand): Promise<any> {
    const banner = await this.repository.findOne(id);

    if (!banner)
      throw new NotFoundException({ message: 'ປ້າຍນີ້ບໍ່ມີໃນລະບົບ' });

    await this.fileUpload.remove(banner.image);
    await this.repository.remove(banner.id);

    return 'ລົບຂໍ້ມູນແບນເນີ້ ສຳເລັດ';
  }
}
