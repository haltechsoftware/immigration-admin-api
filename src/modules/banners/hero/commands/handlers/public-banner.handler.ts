import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BannerRepository } from '../../banner.repository';
import { PublicBannerCommand } from '../impl/public-banner.command';

@CommandHandler(PublicBannerCommand)
export class PublicBannerHandler
  implements ICommandHandler<PublicBannerCommand>
{
  constructor(private readonly repository: BannerRepository) {}

  async execute({ id }: PublicBannerCommand): Promise<any> {
    const banner = await this.repository.findOne(id);

    if (!banner)
      throw new NotFoundException({ message: 'ປ້າຍນີ້ບໍ່ມີໃນລະບົບ' });

    if (banner.is_private === false) {
      throw new BadRequestException({
        message: 'ບໍ່ສາມາດເປິດການມອງເຫັນຊໍ້າໄດ້',
      });
    }

    banner.is_private = false;

    await this.repository.updatePrivate(banner);

    return 'ເປິດການມອງເຫັນສຳເລັດ';
  }
}
