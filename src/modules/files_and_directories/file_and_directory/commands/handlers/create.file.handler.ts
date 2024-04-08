import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { FileAndDirectoryRepository } from '../../file-and-directory.repository';
import { CreateFilesCommand } from '../impl/create-file.command';
@CommandHandler(CreateFilesCommand)
export class CreateFileHandler implements ICommandHandler<CreateFilesCommand> {
  constructor(
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
    private readonly repository: FileAndDirectoryRepository,
  ) {}

  private part: string[] = [];

  async execute({ input }: CreateFilesCommand) {
    if (!!input.directory_id)
      await this.getParentSize(input.directory_id, input.file.size);

    this.part.push('editor');

    const url = await this.fileUpload.upload(
      this.part.reverse().join('/') + '/',
      input.file.buffer,
      input.file.originalName,
    );

    const names = url.split('/');

    await this.repository.create({
      name: names[names.length - 1],
      type: 'file',
      parent_id: input.directory_id ? input.directory_id : undefined,
      size: input.file.size,
    });

    this.part = [];

    return 'ອັບໂຫຼດຟາຍສຳເລັດ';
  }

  async getParentSize(id: number, size: number) {
    const res = await this.repository.updateParentSize(id, size);

    if (res) {
      this.part.push(res.name);

      if (res.parent_id) await this.getParentSize(res.parent_id, size);
    }
  }
}
