import { QueryPopupDtoType } from '../../dto/query-popup.dto';

export default class GetPopupClientQuery {
  constructor(public readonly query: QueryPopupDtoType) {}
}
