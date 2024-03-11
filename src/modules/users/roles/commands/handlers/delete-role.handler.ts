import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleRepository } from '../../repositories/role.repository';
import DeleteRoleCommand from '../impl/delete-role.command';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler
  implements ICommandHandler<DeleteRoleCommand, string>
{
  constructor(private readonly repository: RoleRepository) {}

  async execute({ id }: DeleteRoleCommand) {
    const role = await this.repository.getById(id);

    if (!role)
      throw new NotFoundException({
        message: 'ຂໍ້ມູນບົດບາດນີ້ບໍ່​ມີໃນລະບົບ',
      });

    if (role && role.is_default)
      throw new ConflictException({
        message: 'ບົດບາດນີ້ບໍ່ສາມາດລຶບໄດ້',
      });

    await this.repository.remove(id);

    return 'ລຶບບົດບາດສຳເລັດ';
  }
}
