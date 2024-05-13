import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProvinceRepository } from '../../province.repository';
import { DeleteProvinceCommand } from '../impl/delete-province.command';

@CommandHandler(DeleteProvinceCommand)
export class DeleteProvinceHandler
  implements ICommandHandler<DeleteProvinceCommand>
{
  constructor(private readonly provinceRepository: ProvinceRepository) {}
  async execute({ id }: DeleteProvinceCommand): Promise<any> {
    const province = await this.provinceRepository.findOne(id);

    if (!province)
      throw new NotFoundException({ message: 'ແຂວງນີ້ບໍ່ມີໃນລະບົບ' });

    await this.provinceRepository.remove(province.id);

    return 'ລົບຂໍ້ມູນສຳເລັດ';
  }
}
