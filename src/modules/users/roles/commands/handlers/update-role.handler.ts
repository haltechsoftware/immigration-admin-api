import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleRepository } from '../../repositories/role.repository';
import UpdateRoleCommand from '../impl/update-role.command';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler
  implements ICommandHandler<UpdateRoleCommand, string>
{
  constructor(private readonly repository: RoleRepository) {}

  async execute({ id, dto }: UpdateRoleCommand) {
    const role = await this.repository.getById(id);

    if (!role)
      throw new NotFoundException({ message: 'ຂໍ້ມູນບົດບາດນີ້ບໍ່​ມີໃນລະບົບ' });

    role.id = id;
    role.name = dto.name;
    role.description = dto.description;
    await this.repository.update(role, dto.permission_ids);

    return 'ອັບເດດບົດບາດສຳເລັດ';
  }
}
