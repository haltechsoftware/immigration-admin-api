import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { IncrementTouristExitCommand } from '../impl/increment-tourist-exit.command';

@CommandHandler(IncrementTouristExitCommand)
export class IncrementTouristExitHandler
  implements ICommandHandler<IncrementTouristExitCommand>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute({
    input: { number },
  }: IncrementTouristExitCommand): Promise<any> {
    await this.redis.ts.add('tourists_exit', new Date(), number);

    return 'ເພີ່ມຈຳນວນການເຂົ້າເມື່ອງຂອງນັກທ່ອງທ່ຽວສຳເລັດ';
  }
}
