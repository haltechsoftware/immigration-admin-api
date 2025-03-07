import CreateFeedbackHandler from './create-feedback.handler';
import DeleteFeedbackHandler from './delete-feedback.handler';
import UpdateStatusHandler from './update-status.handler';
import { UploadFeedbackMediaHandler } from './upload-feedback-media.handler';

const feedbackCommandHandlers = [
  UpdateStatusHandler,
  DeleteFeedbackHandler,
  CreateFeedbackHandler,
  UploadFeedbackMediaHandler,
];

export default feedbackCommandHandlers;
