import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { FileAndDirectoryRepository } from '../../file-and-directory.repository';
import { DeleteFileCommand } from '../impl/delete-file.command';

@CommandHandler(DeleteFileCommand)
export class DeleteFilesHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(
    private readonly repository: FileAndDirectoryRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  private part: string[] = [];

  async execute({ id }: DeleteFileCommand): Promise<any> {
    const file = await this.repository.getOneFile(id);

    if (!file) throw new NotFoundException({ message: 'ໄຟລ໌ນີ້ບໍ່ມີໃນລະບົບ' });

    if (file.parent_id) await this.getParent(file.parent_id, file.size);

    this.part.push('editor');

    const fileName = this.part.reverse().join('/') + '/' + file.name;

    await this.fileUpload.remove(fileName);
    await this.repository.remove(file.id);

    this.part = [];

    return 'ລຶບໄຟລ໌ສຳເລັດ';
  }

  async getParent(id: number, size: number) {
    const res = await this.repository.decrementParentSize(id, size);

    if (res) {
      this.part.push(res.name);

      if (res.parent_id) await this.getParent(res.parent_id, size);
    }
  }
}
