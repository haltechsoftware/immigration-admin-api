import DeleteFeedbackHandler from './delete-feedback.handler';
import UpdateStatusHandler from './update-status.handler';
import { UploadFeedbackMediaHandler } from './upload-feedback-media.handler';

const feedbackCommandHandlers = [
  UpdateStatusHandler,
  DeleteFeedbackHandler,
  UploadFeedbackMediaHandler,
];

export default feedbackCommandHandlers;
