import { QueryBannerType } from '../../dtos/query-banner.dto';

export class GetAllBannerQuery {
  constructor(public readonly input: QueryBannerType) {}
}
