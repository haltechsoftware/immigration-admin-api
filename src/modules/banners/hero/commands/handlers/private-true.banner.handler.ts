import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BannerRepository } from '../../banner.repository';
import { PrivateTrueBannerCommand } from '../impl/private-true.banner.command';

@CommandHandler(PrivateTrueBannerCommand)
export class PrivateTrueBannerHandler
  implements ICommandHandler<PrivateTrueBannerCommand>
{
  constructor(private readonly repository: BannerRepository) {}

  async execute({ id }: PrivateTrueBannerCommand): Promise<any> {
    const banner = await this.repository.findOne(id);

    if (!banner)
      throw new NotFoundException({ message: 'ປ້າຍນີ້ບໍ່ມີໃນລະບົບ' });

    if (banner.is_private === true) {
      throw new BadRequestException({
        message: 'ບໍ່ສາມາດປິດການມອງເຫັນຊໍ້າໄດ້',
      });
    }

    banner.is_private = true;

    await this.repository.updatePrivate(banner);

    return 'ປິດການມອງເຫັນສຳເລັດ';
  }
}
