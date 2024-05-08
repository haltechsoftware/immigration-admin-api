import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { DecrementRegisterEnterCommand } from '../impl/decrement-register-enter.command';

@CommandHandler(DecrementRegisterEnterCommand)
export class DecrementRegisterEnterHandler
  implements ICommandHandler<DecrementRegisterEnterCommand>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute({
    input: { number },
  }: DecrementRegisterEnterCommand): Promise<any> {
    await this.redis.ts.add('register_enter', new Date(), -number);

    return 'ລົບຈຳນວນການລົງທະບຽນເຂົ້າເມືອງສຳເລັດ';
  }
}
