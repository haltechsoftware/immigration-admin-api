import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import UpdateNationalityCommand from '../impl/udpate.command';
import { NationalityRepository } from '../../nationality.repository';

@CommandHandler(UpdateNationalityCommand)
export class UpdateNationalityHandler
  implements ICommandHandler<UpdateNationalityCommand>
{
  constructor(
    private readonly _repository: NationalityRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async execute({ id, input }: UpdateNationalityCommand): Promise<any> {
    if (
      input.lo.name === input.en.name ||
      input.zh_cn.name === input.en.name ||
      input.zh_cn.name === input.lo.name
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    const nationality = await this._repository.findOne(id);

    if (!nationality) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    const conflict = await this.drizzle
      .db()
      .query.nationalityTranslate.findMany({
        where: (f, o) =>
          o.or(
            o.and(o.not(o.eq(f.id, input.lo.id)), o.eq(f.name, input.lo.name)),
            o.and(o.not(o.eq(f.id, input.en.id)), o.eq(f.name, input.en.name)),
            o.and(
              o.not(o.eq(f.id, input.zh_cn.id)),
              o.eq(f.name, input.zh_cn.name),
            ),
          ),
      });

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    await this._repository.update({
      id,
      updated_at: format(new Date(), DateTimeFormat.Timestamp),
      translates: [
        {
          id: input.lo.id,
          name: input.lo.name,
          lang: 'lo',
        },
        {
          id: input.en.id,
          name: input.en.name,
          lang: 'en',
        },
        {
          id: input.zh_cn.id,
          name: input.zh_cn.name,
          lang: 'zh_cn',
        },
      ],
    });
    return 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ';
  }
}
