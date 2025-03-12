import { GetLawByIdHandler } from './get-law-by-id.repository';
import { GetLawClientHandler } from './get-law-client.repostory';
import { GetLawHandler } from './get-law.repository';

const lawQueryHandlers = [GetLawHandler, GetLawByIdHandler, GetLawClientHandler];

export default lawQueryHandlers;
