import { GetFeedbackByIdHandler } from "./get-feedback-by-id.repository";
import { GetFeedbackHandler } from "./get-feedback.repository";

const feedbackQueryHandlers = [GetFeedbackByIdHandler, GetFeedbackHandler];

export default feedbackQueryHandlers;
