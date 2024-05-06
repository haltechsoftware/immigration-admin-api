import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LawRepository } from '../../law.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import RemoveLawCommand from '../impl/delete-law.command';

@CommandHandler(RemoveLawCommand)
export default class RemoveLawHandler
  implements ICommandHandler<RemoveLawCommand, string>
{
  constructor(
    private readonly repository: LawRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}
  async execute({ id }: RemoveLawCommand): Promise<any> {
    const law = await this.repository.getById(id);

    if (!law) {
      throw new NotFoundException({ message: 'ບໍ່ມີໄອດີ້ໃນລະບົບ' });
    }

    await this.fileUpload.remove(law.file);
    await this.repository.delete(law.id);

    return 'ລົບຂໍ້ມູນສໍາເລັດ';
  }
}
