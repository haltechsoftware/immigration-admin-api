import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IFileUpload } from 'src/infrastructure/file-upload/file-upload.interface';
import { FILE_UPLOAD_SERVICE } from 'src/infrastructure/file-upload/inject-key';
import { FeedbackRepository } from '../../feedback.repository';
import DeleteFeedbackCommand from '../impl/delete-feedback.command';

@CommandHandler(DeleteFeedbackCommand)
export default class DeleteFeedbackHandler
  implements ICommandHandler<DeleteFeedbackCommand, string>
{
  constructor(
    private readonly repository: FeedbackRepository,
    @Inject(FILE_UPLOAD_SERVICE) private readonly fileUpload: IFileUpload,
  ) {}

  async execute({ id }: DeleteFeedbackCommand): Promise<string> {
    const feedback = await this.repository.getById(id);

    if (!feedback)
      throw new NotFoundException({ message: 'ຄຳຕິຊົມບໍ່ມີໃນລະບົບ' });

    if (feedback.media) await this.fileUpload.remove(feedback.media);

    await this.repository.remove(id);

    return 'ຄຳຕິຊົມແບັກສຳເລັດ';
  }
}
