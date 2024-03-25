import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BannerRepository } from '../../banner.repository';
import { PrivateFalseBannerCommand } from '../impl/private-false.banner.command';

@CommandHandler(PrivateFalseBannerCommand)
export class PrivateFalseBannerHandler
  implements ICommandHandler<PrivateFalseBannerCommand>
{
  constructor(private readonly repository: BannerRepository) {}

  async execute({ id }: PrivateFalseBannerCommand): Promise<any> {
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
