import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileAndDirectoryRepository } from '../../file_and_directory.repository';
import { CreateDirectoryCommand } from '../impl/create-directory.command';
@CommandHandler(CreateDirectoryCommand)
export class CreateDirectoryHandler
  implements ICommandHandler<CreateDirectoryCommand>
{
  constructor(private readonly repository: FileAndDirectoryRepository) {}

  async execute({ input }: CreateDirectoryCommand): Promise<any> {
    await this.repository.create({
      type: 'directory',
      name: input.name,
      parent_id: input.directory_id,
      size: 0,
    });

    return { message: 'ສ້າງໂຟນເດີສຳເລັດ' };
  }
}
