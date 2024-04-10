import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { VisaCategory } from "src/modules/visa/entities";

export default class GetVisaCategoryQuery {
    constructor(public readonly paginate: IOffsetBasePaginate<VisaCategory>) {}
  }