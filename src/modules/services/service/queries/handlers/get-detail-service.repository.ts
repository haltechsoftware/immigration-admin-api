import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetDetailServiceQuery } from '../impl/get-detail-service';

@QueryHandler(GetDetailServiceQuery)
export class GetDetailServiceHandler
  implements IQueryHandler<GetDetailServiceQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ id, query: { lang } }: GetDetailServiceQuery) {
    const res = await this.drizzle.db().query.services.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: {
          where: (fields, { eq }) => (lang ? eq(fields.lang, lang) : undefined),
        },
      },
    });

    if (!res)
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນການບໍລິການ' });

    return {
      ...res,
      lang_id: res.translates[0].id,
      title: res.translates[0].title,
      description: res.translates[0].description,
      content: res.translates[0].content,
      translates: undefined,
    };
  }
}
