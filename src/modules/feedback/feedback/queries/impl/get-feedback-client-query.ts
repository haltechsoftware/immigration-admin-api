import { QueryFeedbackDtoType } from "../../dto/query-feedback.dto";

export default class GetFeedbackClientQuery {
    constructor(public readonly query: QueryFeedbackDtoType) 
    {}
}