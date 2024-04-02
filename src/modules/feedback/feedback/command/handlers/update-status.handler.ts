import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FeedbackRepository } from '../../feedback.repository';
import UpdateStatusCommand from '../impl/update-status.command';

@CommandHandler(UpdateStatusCommand)
export default class UpdateStatusHandler
  implements ICommandHandler<UpdateStatusCommand, string>
{
  constructor(private readonly repository: FeedbackRepository) {}

  async execute({ dto, id }: UpdateStatusCommand): Promise<string> {
    const feedback = await this.repository.getById(id);

    if (!feedback) throw new NotFoundException('ຄຳຕິຊົມບໍ່ມີໃນລະບົບ');

    await this.repository.updateStatus({
      id,
      is_published: dto.is_published,
    });

    return 'ອັດເດດຄຳຕິຊົມສຳເລັດ';
  }
}
