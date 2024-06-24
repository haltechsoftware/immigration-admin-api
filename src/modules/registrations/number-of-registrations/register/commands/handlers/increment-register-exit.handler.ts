import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { IncrementRegisterExitCommand } from '../impl/increment-register-exit.command';

@CommandHandler(IncrementRegisterExitCommand)
export class IncrementRegisterExitHandler
  implements ICommandHandler<IncrementRegisterExitCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: IncrementRegisterExitCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: number, type: 'register-exit' });

    return 'ເພີ່ມຈຳນວນການລົງທະບຽນອອກເມືອງສຳເລັດ';
  }
}
