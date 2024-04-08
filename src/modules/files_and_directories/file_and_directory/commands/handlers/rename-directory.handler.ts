import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileAndDirectoryRepository } from '../../file-and-directory.repository';
import { RenameDirectoryCommand } from '../impl/rename-directory.command';

@CommandHandler(RenameDirectoryCommand)
export class RenameDirectoryHandler
  implements ICommandHandler<RenameDirectoryCommand>
{
  constructor(private readonly repository: FileAndDirectoryRepository) {}

  async execute({ input, id }: RenameDirectoryCommand): Promise<any> {
    const exist = await this.repository.checkDirIsExist(
      input.name,
      input.directory_id,
      id,
    );

    if (!!exist) throw new ConflictException({ message: 'ຊື່ໂຟນເດີມີແລ້ວ' });

    const folder = await this.repository.getOneDirectory(id);

    if (!folder)
      throw new NotFoundException({ message: 'ໂຟນເດີນີ້ບໍ່ມີໃນລະບົບ' });

    await this.repository.renameDirectory(id, input.name);

    return 'ປ່ຽນຊື່ໂພນເດີສຳເລັດ';
  }
}
