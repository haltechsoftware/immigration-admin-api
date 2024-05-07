import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { IncrementRegisterExitCommand } from '../impl/increment-register-exit.command';

@CommandHandler(IncrementRegisterExitCommand)
export class IncrementRegisterExitHandler
  implements ICommandHandler<IncrementRegisterExitCommand>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute({
    input: { number },
  }: IncrementRegisterExitCommand): Promise<any> {
    await this.redis.ts.add('register_exit', new Date(), number);

    return 'ເພີ່ມຈຳນວນການລົງທະບຽນອອກເມືອງສຳເລັດ';
  }
}
