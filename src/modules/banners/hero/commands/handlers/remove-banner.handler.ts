import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeFileUploadService } from 'src/infrastructure/file-upload/node/node-file-upload.service';
import { BannerRepository } from '../../banner.repository';
import { RemoveBannerCommand } from '../impl/remove-banner';

@CommandHandler(RemoveBannerCommand)
export class RemoveBannerHandler
  implements ICommandHandler<RemoveBannerCommand>
{
  constructor(
    private readonly repository: BannerRepository,
    private readonly fileUpload: NodeFileUploadService,
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
