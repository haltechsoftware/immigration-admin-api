import CreateLawHandler from './create-law.handler';
import RemoveLawHandler from './delete-law.handler';
import UpdateLawHandler from './update-law.handler';

const lawCommandHandlers = [
  CreateLawHandler,
  UpdateLawHandler,
  RemoveLawHandler,
];

export default lawCommandHandlers;
