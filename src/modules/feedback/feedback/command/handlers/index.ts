import DeleteFeedbackHandler from "./delete-feedback.handler";
import UpdateStatusHandler from "./update-status.handler";



const feedbackCommandHandlers = [
    UpdateStatusHandler,
    DeleteFeedbackHandler
];
  
export default feedbackCommandHandlers;