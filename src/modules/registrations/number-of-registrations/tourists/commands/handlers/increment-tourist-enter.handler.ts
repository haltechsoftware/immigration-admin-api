import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { IncrementTouristEnterCommand } from '../impl/increment-tourist-enter.command';

@CommandHandler(IncrementTouristEnterCommand)
export class IncrementTouristEnterHandler
  implements ICommandHandler<IncrementTouristEnterCommand>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute({
    input: { number },
  }: IncrementTouristEnterCommand): Promise<any> {
    await this.redis.ts.add('tourists_enter', new Date(), number);

    return 'ເພີ່ມຈຳນວນການເຂົ້າເມື່ອງຂອງນັກທ່ອງທ່ຽວສຳເລັດ';
  }
}
