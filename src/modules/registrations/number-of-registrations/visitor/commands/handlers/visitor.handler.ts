import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { VisitorCommand } from "../impl/visitor.command";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { timeSeries } from "src/modules/registrations/entities";

@CommandHandler(VisitorCommand)
export class VisitorHandler
  implements ICommandHandler<VisitorCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: VisitorCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: number, type: 'visitor' });

    return 'ເພີ່ມຈຳນວນຜູ້ເຂົ້າຊົມສຳເລັດ';
  }

}