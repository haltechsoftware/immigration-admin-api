import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeFileUploadService } from 'src/infrastructure/file-upload/node/node-file-upload.service';
import { DeleteDirectoryCommand } from '../impl/delete-directory.command';
import { FileAndDirectoryRepository } from '../../file_and_directory.repository';
import { DeleteFileCommand } from '../impl/delete-file.command';


@CommandHandler(DeleteFileCommand)
export class DeleteFilesHandler
  implements ICommandHandler<DeleteFileCommand>
{
  constructor(
    private readonly repository: FileAndDirectoryRepository,
    private readonly fileUpload: NodeFileUploadService,
  ) {}
  async execute({ id }: DeleteFileCommand): Promise<any> {
    const files = await this.repository.findOne(id);

    if (!files)
      throw new NotFoundException({ message: 'ຟາຍນີ້ບໍ່ມີໃນລະບົບ' });
    if(files.type === 'directory') throw new BadRequestException({message: 'ຟາຍນີ້ບໍ່ມີໃນລະບົບ'})
    await this.fileUpload.remove(files.name);
    await this.repository.remove(files.id);

    return 'ລົບຟາຍ ສຳເລັດ';
  }
}
