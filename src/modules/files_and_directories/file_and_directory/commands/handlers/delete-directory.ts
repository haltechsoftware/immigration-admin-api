import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileAndDirectoryRepository } from '../../file-and-directory.repository';
import { DeleteDirectoryCommand } from '../impl/delete-directory.command';

@CommandHandler(DeleteDirectoryCommand)
export class DeleteDirectoryHandler
  implements ICommandHandler<DeleteDirectoryCommand>
{
  constructor(private readonly repository: FileAndDirectoryRepository) {}
  async execute({ id }: DeleteDirectoryCommand): Promise<any> {
    const folder = await this.repository.getOneDirectory(id);

    if (!folder)
      throw new NotFoundException({ message: 'ໂຟນເດີນີ້ບໍ່ມີໃນລະບົບ' });

    if (folder.files_or_directories.length > 0)
      throw new NotAcceptableException({
        message: 'ບໍ່ສາມາດລຶບໂຟນເດີທີ່ມີໄຟລ໌ ຫຼື ໂພນເດີທາງໃນໄດ້',
      });

    await this.repository.remove(folder.id);

    return 'ລຶບໂພນເດີສຳເລັດ';
  }
}
