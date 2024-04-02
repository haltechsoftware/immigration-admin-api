import { QueryFeedbackDtoType } from "../../dto/query-feedback.dto";

export default class GetFeedbackQuery {
    constructor(public readonly query: QueryFeedbackDtoType) 
    {}
}
  