import { Provider } from "@nestjs/common";
import { CreateCheckpointHandler } from "./create.handler";
import { UpdateCheckpointHandler } from "./update.handler";
import { DeleteCheckpointHandler } from "./delete.handler";

export const checkPointHandler : Provider[] = [
    CreateCheckpointHandler,
    UpdateCheckpointHandler,
    DeleteCheckpointHandler
]