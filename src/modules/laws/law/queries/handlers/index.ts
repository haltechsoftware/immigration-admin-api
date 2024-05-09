import { GetLawByIdHandler } from './get-law-by-id.repository';
import { GetLawHandler } from './get-law.repository';

const lawQueryHandlers = [GetLawHandler, GetLawByIdHandler];

export default lawQueryHandlers;
