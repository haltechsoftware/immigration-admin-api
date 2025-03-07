import { CreateFeedbackDtoType } from "../../dto/create-feedback.dto";

export default class CreateFeedbackCommand {
    constructor(
        public readonly dto: CreateFeedbackDtoType,
    ) {}
}