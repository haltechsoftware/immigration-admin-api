import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetDetailLostPassportQuery } from '../impl/get-detail-lost-passport.query';

@QueryHandler(GetDetailLostPassportQuery)
export class GetDetailLostPassportHandler
  implements IQueryHandler<GetDetailLostPassportQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ id, query: { lang } }: GetDetailLostPassportQuery) {
    const res = await this.drizzle.db().query.lostPassport.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: {
          where: (fields, { eq }) => (lang ? eq(fields.lang, lang) : undefined),
        },
      },
    });

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    return {
      ...res,
      lang_id: res.translates[0].id,
      title: res.translates[0].title,
      content: res.translates[0].content,
      translates: undefined,
    };
  }
}
