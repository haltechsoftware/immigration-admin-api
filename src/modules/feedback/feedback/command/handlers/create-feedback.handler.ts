import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import CreateFeedbackCommand from "../impl/create-feedback-command";
import { FeedbackRepository } from "../../feedback.repository";

@CommandHandler(CreateFeedbackCommand)
export default class CreateFeedbackHandler
  implements ICommandHandler<CreateFeedbackCommand, string>
{
  constructor(private readonly repository: FeedbackRepository) {}

  async execute({ dto }: CreateFeedbackCommand): Promise<string> {
    await this.repository.create({
            name: dto.fullName,
            email: dto.email,
            tel: dto.tel,
            message: dto.message,
            media: dto.media
        });
    
    return 'ເພີ່ມຄຳຕິຊົມສຳເລັດ';
  }
}