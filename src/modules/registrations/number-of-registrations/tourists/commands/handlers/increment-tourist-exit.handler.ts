import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { IncrementTouristExitCommand } from '../impl/increment-tourist-exit.command';

@CommandHandler(IncrementTouristExitCommand)
export class IncrementTouristExitHandler
  implements ICommandHandler<IncrementTouristExitCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: IncrementTouristExitCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: number, type: 'tourists-exit' });

    return 'ເພີ່ມຈຳນວນການລົງທະບຽນອອກເມື່ອງຂອງນັກທ່ອງທ່ຽວສຳເລັດ';
  }
}
