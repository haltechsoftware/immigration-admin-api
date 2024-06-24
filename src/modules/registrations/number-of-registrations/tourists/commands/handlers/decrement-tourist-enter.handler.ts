import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { DecrementTouristEnterCommand } from '../impl/decrement-tourist-enter.command';

@CommandHandler(DecrementTouristEnterCommand)
export class DecrementTouristEnterHandler
  implements ICommandHandler<DecrementTouristEnterCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input: { number },
  }: DecrementTouristEnterCommand): Promise<any> {
    await this.drizzle
      .db()
      .insert(timeSeries)
      .values({ number: -number, type: 'tourists-enter' });

    return 'ລົບຈຳນວນການລົງທະບຽນເຂົ້າເມືອງຂອງນັກທ່ອງທ່ຽວສຳເລັດ';
  }
}
