import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileAndDirectoryRepository } from '../../file-and-directory.repository';
import { CreateDirectoryCommand } from '../impl/create-directory.command';
@CommandHandler(CreateDirectoryCommand)
export class CreateDirectoryHandler
  implements ICommandHandler<CreateDirectoryCommand>
{
  constructor(private readonly repository: FileAndDirectoryRepository) {}

  async execute({ input }: CreateDirectoryCommand): Promise<any> {
    const exist = await this.repository.checkDirIsExist(
      input.name,
      input.directory_id,
    );

    if (!!exist) throw new ConflictException({ message: 'ຊື່ໂຟນເດີມີແລ້ວ' });

    await this.repository.create({
      type: 'directory',
      name: input.name,
      parent_id: input.directory_id === 0 ? undefined : input.directory_id,
      size: 0,
    });

    return 'ສ້າງໂຟນເດີສຳເລັດ';
  }
}
