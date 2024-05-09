import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { CheckVerifyCodeCommand } from '../impl/check-verify-code.command';

@CommandHandler(CheckVerifyCodeCommand)
export class CheckVerifyCodeHandler
  implements ICommandHandler<CheckVerifyCodeCommand>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ data: { code } }: CheckVerifyCodeCommand): Promise<any> {
    const arrival = await this.drizzle
      .db()
      .query.arrivalRegistration.findFirst({
        where: (f, o) => o.eq(f.verification_code, code),
      });

    if (!arrival) throw new NotFoundException({ message: 'ລະຫັດບໍ່ຖືກຕ້ອງ!' });

    return 'ກວດສອບສຳເລັດ!';
  }
}
