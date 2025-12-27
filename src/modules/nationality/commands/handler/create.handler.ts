import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CreateNationalityCommand from '../impl/create.command';
import { NationalityRepository } from '../../nationality.repository';
import { ConflictException } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { nationalityTranslate } from '../../entities';
import { eq, or } from 'drizzle-orm';

@CommandHandler(CreateNationalityCommand)
export default class CreateNationalityHandler
  implements ICommandHandler<CreateNationalityCommand, string>
{
  constructor(
    private readonly _repository: NationalityRepository,
    private readonly drizzle: DrizzleService,
  ) {}
  async execute({ dto }: CreateNationalityCommand): Promise<string> {
    if (
      dto.lo.name === dto.en.name ||
      dto.zh_cn.name === dto.en.name ||
      dto.zh_cn.name === dto.lo.name
    )
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    // const nationality = await this._repository.findOne(id);

    // if (!nationality) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    const conflict = await this.drizzle
      .db()
      .select({ id: nationalityTranslate.id })
      .from(nationalityTranslate)
      .where(
        or(
          eq(nationalityTranslate.name, dto.lo.name),
          eq(nationalityTranslate.name, dto.en.name),
          eq(nationalityTranslate.name, dto.zh_cn.name),
        ),
      )
      .limit(1);

    if (conflict.length > 0)
      throw new ConflictException({ message: 'ຂໍ້ມູນຊ້ຳກັນ!' });

    await this._repository.create({
      translates: [
        {
          name: dto.lo.name,
          short_name: dto.lo.short_name,
          lang: 'lo',
        },
        {
          name: dto.en.name,
          short_name: dto.en.short_name,
          lang: 'en',
        },
        {
          name: dto.zh_cn.name,
          short_name: dto.zh_cn.short_name,
          lang: 'zh_cn',
        },
      ],
    });

    return 'ບັນທຶກຂໍ້ມູນສຳເລັດ';
  }
}
