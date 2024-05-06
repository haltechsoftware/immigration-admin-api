import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetVisaCategoryDetailQuery } from '../impl/get-visa-category-detail.query';

@QueryHandler(GetVisaCategoryDetailQuery)
export class GetVisaCategoryDetailHandler
  implements IQueryHandler<GetVisaCategoryDetailQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    id,
    query: { lang },
  }: GetVisaCategoryDetailQuery): Promise<any> {
    const res = await this._drizzle.db().query.visaCategories.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: {
          where: (fields, { eq }) => (lang ? eq(fields.lang, lang) : undefined),
        },
      },
    });

    if (!res)
      throw new NotFoundException({ message: 'ປະເພດວີຊານີ້ບໍ່ມີໃນລະບົບ' });

    return {
      ...res,
      lang_id: res.translates[0].id,
      name: res.translates[0].name,
      content: res.translates[0].content,
      translates: undefined,
    };
  }
}
