import { GetVisaCategoryHandler } from "./get-visa_category-all.repository";
import { GetOneVisaCategoryQueryHandler } from "./get-visa_category-by-id.repository";

const visaCategoryQueryHandlers = [GetOneVisaCategoryQueryHandler, GetVisaCategoryHandler];

export default visaCategoryQueryHandlers;