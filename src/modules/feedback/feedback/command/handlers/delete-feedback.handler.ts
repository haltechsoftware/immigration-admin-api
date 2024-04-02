import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NodeFileUploadService } from 'src/infrastructure/file-upload/node/node-file-upload.service';
import { FeedbackRepository } from '../../feedback.repository';
import DeleteFeedbackCommand from '../impl/delete-feedback.command';

@CommandHandler(DeleteFeedbackCommand)
export default class DeleteFeedbackHandler
  implements ICommandHandler<DeleteFeedbackCommand, string>
{
  constructor(
    private readonly repository: FeedbackRepository,
    private readonly fileUpload: NodeFileUploadService,
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
