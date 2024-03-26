import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeFileUploadService } from 'src/infrastructure/file-upload/node/node-file-upload.service';
import { PopupRepository } from '../../popup.repository';
import DeletePopupCommand from '../impl/delete-popup.command';

@CommandHandler(DeletePopupCommand)
export default class DeletePopupHandler
  implements ICommandHandler<DeletePopupCommand, string>
{
  constructor(
    private readonly repository: PopupRepository,
    private readonly fileUpload: NodeFileUploadService,
  ) {}

  async execute({ id }: DeletePopupCommand): Promise<string> {
    const popup = await this.repository.getById(id);

    if (!popup) throw new NotFoundException({ message: 'ປ໊ອບອັບບໍ່ມີໃນລະບົບ' });

    await this.fileUpload.remove(popup.image);

    await this.repository.remove(id);

    return 'ລຶບປ໊ອບອັບສຳເລັດ';
  }
}
