import { Provider } from "@nestjs/common";
import { CreateCheckpointCategoryHandler } from "./create.handler";
import { UpdateCheckpointCategoryHandler } from "./update.handler";
import { DeleteCheckpointCategoryHandler } from "./delete.handler";

export const checkPointCategoryHandler : Provider[] = [
    CreateCheckpointCategoryHandler,
    UpdateCheckpointCategoryHandler,
    DeleteCheckpointCategoryHandler
]