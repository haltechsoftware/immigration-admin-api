import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { IncrementRegisterEnterCommand } from '../impl/increment-register-enter.command';

@CommandHandler(IncrementRegisterEnterCommand)
export class IncrementRegisterEnterHandler
  implements ICommandHandler<IncrementRegisterEnterCommand>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute({
    input: { number },
  }: IncrementRegisterEnterCommand): Promise<any> {
    await this.redis.ts.add('register_enter', new Date(), number);

    return 'ເພີ່ມຈຳນວນການລົງທະບຽນເຂົ້າເມືອງສຳເລັດ';
  }
}
