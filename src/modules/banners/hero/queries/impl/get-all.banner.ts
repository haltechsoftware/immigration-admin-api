import { Banners } from "src/modules/banners/entities";
import { QueryBannerType } from "../../dtos/query-banner.dto";
import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";

export class GetAllBannerQuery {
    constructor(
        public readonly input: QueryBannerType,
        public readonly paginate: IOffsetBasePaginate<Banners>
    ){}
}