import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { NewsRepository } from '../../news.repository';
import { RemoveNewsCommand } from '../impl/remove-news.command';

@CommandHandler(RemoveNewsCommand)
export class RemoveNewsHandler implements ICommandHandler<RemoveNewsCommand> {
  constructor(
    private readonly repository: NewsRepository,
    @Inject(FILE_UPLOAD_SERVICE)
    private readonly fileUpload: IFileUpload,
  ) {}
  async execute({ id }: RemoveNewsCommand): Promise<any> {
    const res = await this.repository.findOne(id);

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    if (res.thumbnail) {
      await this.fileUpload.remove(res.thumbnail);
    }

    await this.repository.remove(res.id);

    return 'ລົບຂໍ້ມູນສຳເລັດ';
  }
}
