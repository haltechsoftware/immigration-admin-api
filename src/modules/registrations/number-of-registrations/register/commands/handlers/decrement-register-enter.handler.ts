import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { DecrementRegisterEnterCommand } from '../impl/decrement-register-enter.command';

@CommandHandler(DecrementRegisterEnterCommand)
export class DecrementRegisterEnterHandler
  implements ICommandHandler<DecrementRegisterEnterCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: DecrementRegisterEnterCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: -number, type: 'register-enter' });

    return 'ລົບຈຳນວນການລົງທະບຽນເຂົ້າເມືອງສຳເລັດ';
  }
}
