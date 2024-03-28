import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import UpdateStatusCommand from "../impl/update-status.command";
import { FeedbackRepository } from "../../feedback.repository";
import { NotFoundException } from "@nestjs/common";

@CommandHandler(UpdateStatusCommand)
export default class UpdateStatusHandler
  implements ICommandHandler<UpdateStatusCommand, string>
{
  constructor(private readonly repository: FeedbackRepository) {}

  async execute({ dto, id }: UpdateStatusCommand): Promise<string> {
    const popup = await this.repository.getById(id);

    if (!popup) throw new NotFoundException('ຟິກເເບັກບໍ່ມີໃນລະບົບ');

    await this.repository.updateStatus({
      id,
      is_published: dto.is_published,
    });

    return 'ອັດເດດຟິກແບັກສຳເລັດ';
  }
}
