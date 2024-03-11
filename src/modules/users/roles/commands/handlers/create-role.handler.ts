import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleRepository } from '../../repositories/role.repository';
import CreateRoleCommand from '../impl/create-role.command';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler
  implements ICommandHandler<CreateRoleCommand, string>
{
  constructor(private readonly repository: RoleRepository) {}

  async execute({ dto }: CreateRoleCommand) {
    await this.repository.create(
      {
        name: dto.name,
        description: dto.description,
      },
      dto.permission_ids,
    );

    return 'ເພີ່ມບົດບາດສຳເລັດ';
  }
}
