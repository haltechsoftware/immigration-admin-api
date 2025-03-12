import { GetVisaCategoryDetailHandler } from './get-visa-category-detail.repository';
import { GetVisaCategoryHandler } from './get-visa_category-all.repository';
import { GetOneVisaCategoryQueryHandler } from './get-visa_category-by-id.repository';
import { GetVisaCategoryClientHandler } from './get-visa_category-client.repository';

const visaCategoryQueryHandlers = [
  GetVisaCategoryDetailHandler,
  GetOneVisaCategoryQueryHandler,
  GetVisaCategoryHandler,
  GetVisaCategoryClientHandler,
];

export default visaCategoryQueryHandlers;
