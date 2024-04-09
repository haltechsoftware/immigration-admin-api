import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { IPaginated } from 'src/common/interface/pagination/paginated.interface';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { accommodationRequest } from 'src/modules/accommodation_requests/entities';
import { GetPaginateAccommodationRequest } from '../impl/get-paginate-accommodation-request';

@QueryHandler(GetPaginateAccommodationRequest)
export class GetPaginateAccommodationRequestHandler
  implements IQueryHandler<GetPaginateAccommodationRequest, IPaginated<any>>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(accommodationRequest)
    .prepare('count-accommodation_request');

  async execute({
    paginate: { offset, limit },
  }: GetPaginateAccommodationRequest): Promise<any> {
    const res = await this._drizzle.db().query.accommodationRequest.findMany({
      with: {
        translates: {
          columns: { title: true },
        },
      },
      offset,
      limit,
    });

    const total = await this._prepared.execute();

    return {
      data: res,
      total: total[0].value,
    };
  }
}
