import { IOffsetBasePaginate } from "src/common/interface/pagination/pagination.interface";
import { BannerPopup } from '../../../entities/banner_popups';

export default class GetPopupQuery {
    constructor(public readonly paginate: IOffsetBasePaginate<BannerPopup>) {}
  }