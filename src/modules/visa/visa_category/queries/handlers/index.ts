import { GetVisaCategoryDetailHandler } from './get-visa-category-detail.repository';
import { GetVisaCategoryHandler } from './get-visa_category-all.repository';
import { GetOneVisaCategoryQueryHandler } from './get-visa_category-by-id.repository';

const visaCategoryQueryHandlers = [
  GetVisaCategoryDetailHandler,
  GetOneVisaCategoryQueryHandler,
  GetVisaCategoryHandler,
];

export default visaCategoryQueryHandlers;
