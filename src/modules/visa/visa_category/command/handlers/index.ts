import CreateVisaCategoryHandler from "./create-visa_category.handler";
import { RemoveVisaCategoryHandler } from "./remove-visa_category.handler";
import { UpdateVisaCategoryHandler } from "./update-visa_category.handler";

const visaCategoryCommandHandlers = [
    CreateVisaCategoryHandler,
    UpdateVisaCategoryHandler,
    RemoveVisaCategoryHandler
];
  
export default visaCategoryCommandHandlers;