import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import DeleteFeedbackCommand from "../impl/delete-feedback.command";
import { FeedbackRepository } from "../../feedback.repository";

@CommandHandler(DeleteFeedbackCommand)
export default class DeleteFeedbackHandler
  implements ICommandHandler<DeleteFeedbackCommand, string>
{
  constructor(
    private readonly repository: FeedbackRepository,
  ) {}

  async execute({ id }: DeleteFeedbackCommand): Promise<string> {
    const popup = await this.repository.getById(id);

    if (!popup) throw new NotFoundException({ message: 'ຟິກແບັກບໍ່ມີໃນລະບົບ' });

    // await this.fileUpload.remove(popup.image);

    await this.repository.remove(id);

    return 'ລຶບຟິກແບັກສຳເລັດ';
  }
}