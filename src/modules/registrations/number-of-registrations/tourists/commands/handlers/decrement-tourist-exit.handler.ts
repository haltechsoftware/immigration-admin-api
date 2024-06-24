import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { DecrementTouristExitCommand } from '../impl/decrement-tourist-exit.command';

@CommandHandler(DecrementTouristExitCommand)
export class DecrementTouristExitHandler
  implements ICommandHandler<DecrementTouristExitCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: DecrementTouristExitCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: -number, type: 'tourists-exit' });

    return 'ລົບຈຳນວນການລົງທະບຽນອອກເມືອງຂອງນັກທ່ອງທ່ຽວສຳເລັດ';
  }
}
