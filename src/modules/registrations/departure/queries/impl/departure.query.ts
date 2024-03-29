import { QueryDepartureDtoType } from '../../dto/query-departure.dto';

export default class DepartureRegisterQuery {
  constructor(public readonly query: QueryDepartureDtoType) {}
}
