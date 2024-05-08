import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { DecrementTouristEnterCommand } from '../impl/decrement-tourist-enter.command';

@CommandHandler(DecrementTouristEnterCommand)
export class DecrementTouristEnterHandler
  implements ICommandHandler<DecrementTouristEnterCommand>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute({
    input: { number },
  }: DecrementTouristEnterCommand): Promise<any> {
    await this.redis.ts.add('tourists_enter', new Date(), -number);

    return 'ລົບຈຳນວນການລົງທະບຽນເຂົ້າເມືອງຂອງນັກທ່ອງທ່ຽວສຳເລັດ';
  }
}
