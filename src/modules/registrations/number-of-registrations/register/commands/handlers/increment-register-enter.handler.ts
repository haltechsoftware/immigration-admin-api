import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { IncrementRegisterEnterCommand } from '../impl/increment-register-enter.command';

@CommandHandler(IncrementRegisterEnterCommand)
export class IncrementRegisterEnterHandler
  implements ICommandHandler<IncrementRegisterEnterCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: IncrementRegisterEnterCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: number, type: 'register-enter' });

    return 'ເພີ່ມຈຳນວນການລົງທະບຽນເຂົ້າເມືອງສຳເລັດ';
  }
}
