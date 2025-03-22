import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ContactRepository } from "../../contact.repository";
import SendContactCommand from "../impl/send-contact.command";


@CommandHandler(SendContactCommand)
export default class SendContactHandler
  implements ICommandHandler<SendContactCommand, string>
{
  constructor(private readonly repository: ContactRepository) {}

  async execute({ input }: SendContactCommand): Promise<string> {
    await this.repository.create({ input });
    return 'ສົ່ງຂໍ້ມູນຕິດຕໍ່ພວກເຮົາສຳເລັດ';
  }
}