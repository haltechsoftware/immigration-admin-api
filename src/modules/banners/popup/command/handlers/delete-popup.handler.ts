import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { PopupRepository } from '../../popup.repository';
import DeletePopupCommand from '../impl/delete-popup.command';

@CommandHandler(DeletePopupCommand)
export default class DeletePopupHandler
  implements ICommandHandler<DeletePopupCommand, string>
{
  constructor(
    private readonly repository: PopupRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ id }: DeletePopupCommand): Promise<string> {
    const popup = await this.repository.getById(id);

    if (!popup) throw new NotFoundException({ message: 'ປ໊ອບອັບບໍ່ມີໃນລະບົບ' });

    await this.fileUpload.remove(popup.image);

    await this.repository.remove(id);

    return 'ລຶບປ໊ອບອັບສຳເລັດ';
  }
}
