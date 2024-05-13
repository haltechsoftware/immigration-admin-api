import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { CheckpointRepository } from '../../checkpoint.repository';
import { DeleteCheckpointCommand } from '../impl/delete.command';

@CommandHandler(DeleteCheckpointCommand)
export class DeleteCheckpointHandler
  implements ICommandHandler<DeleteCheckpointCommand>
{
  constructor(
    private readonly checkPointRepository: CheckpointRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ id }: DeleteCheckpointCommand): Promise<any> {
    const checkpoint = await this.checkPointRepository.findOne(id);

    if (!checkpoint)
      throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

    await this.fileUpload.remove(checkpoint.image);

    await this.checkPointRepository.remove(checkpoint.id);

    return 'ລົບຂໍ້ມູນສຳເລັດ';
  }
}
