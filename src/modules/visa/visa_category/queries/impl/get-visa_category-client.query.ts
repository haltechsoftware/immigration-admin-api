import { QueryVisaCategoryType } from "../../dto/query-visa-category.dto";

export default class GetVisaCategoryClientQuery {
  constructor(public readonly filter: QueryVisaCategoryType) {}
}