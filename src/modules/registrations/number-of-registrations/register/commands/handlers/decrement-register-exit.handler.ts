import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { DecrementRegisterExitCommand } from '../impl/decrement-register-exit.command';

@CommandHandler(DecrementRegisterExitCommand)
export class DecrementRegisterExitHandler
  implements ICommandHandler<DecrementRegisterExitCommand>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute({
    input: { number },
  }: DecrementRegisterExitCommand): Promise<any> {
    await this.redis.ts.add('register_exit', new Date(), -number);

    return 'ລົບຈຳນວນການລົງທະບຽນອອກເມືອງສຳເລັດ';
  }
}
