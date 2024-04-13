import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetDetailAccommodationRequest } from '../impl/get-detail-accommodation-request';

@QueryHandler(GetDetailAccommodationRequest)
export class DetailAccommodationRequestHandler
  implements IQueryHandler<GetDetailAccommodationRequest>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ id, query: { lang } }: GetDetailAccommodationRequest) {
    const res = await this.drizzle.db().query.accommodationRequest.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: {
          where: (fields, { eq }) => (lang ? eq(fields.lang, lang) : undefined),
        },
      },
    });

    if (!res)
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກ' });

    return {
      ...res,
      lang_id: res.translates[0].id,
      title: res.translates[0].title,
      content: res.translates[0].content,
      translates: undefined,
    };
  }
}
