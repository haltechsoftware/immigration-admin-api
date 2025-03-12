import { GetFeedbackByIdHandler } from "./get-feedback-by-id.repository";
import { GetFeedbackClientHandler } from "./get-feedback-client.repository";
import { GetFeedbackHandler } from "./get-feedback.repository";

const feedbackQueryHandlers = [GetFeedbackByIdHandler, GetFeedbackHandler, GetFeedbackClientHandler];

export default feedbackQueryHandlers;
