import { QueryPopupDtoType } from '../../dto/query-popup.dto';

export default class GetPopupQuery {
  constructor(public readonly query: QueryPopupDtoType) {}
}
