import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { IncrementTouristEnterCommand } from '../impl/increment-tourist-enter.command';

@CommandHandler(IncrementTouristEnterCommand)
export class IncrementTouristEnterHandler
  implements ICommandHandler<IncrementTouristEnterCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: IncrementTouristEnterCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: number, type: 'tourists-enter' });

    return 'ເພີ່ມຈຳນວນການລົງທະບຽນເຂົ້າເມືອງຂອງນັກທ່ອງທ່ຽວສຳເລັດ';
  }
}
