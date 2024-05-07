import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { DecrementTouristExitCommand } from '../impl/decrement-tourist-exit.command';

@CommandHandler(DecrementTouristExitCommand)
export class DecrementTouristExitHandler
  implements ICommandHandler<DecrementTouristExitCommand>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute({
    input: { number },
  }: DecrementTouristExitCommand): Promise<any> {
    await this.redis.ts.decrBy('tourists_exit', number);

    return 'ລົບຈຳນວນການເຂົ້າເມື່ອງຂອງນັກທ່ອງທ່ຽວສຳເລັດ';
  }
}
