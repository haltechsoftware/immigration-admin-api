import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { DecrementRegisterExitCommand } from '../impl/decrement-register-exit.command';

@CommandHandler(DecrementRegisterExitCommand)
export class DecrementRegisterExitHandler
  implements ICommandHandler<DecrementRegisterExitCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: DecrementRegisterExitCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: -number, type: 'register-exit' });

    return 'ລົບຈຳນວນການລົງທະບຽນອອກເມືອງສຳເລັດ';
  }
}
