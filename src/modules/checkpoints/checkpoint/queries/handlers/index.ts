import { Provider } from "@nestjs/common";
import { QueryGetAllCheckpointHandler } from "./get-all";
import { QueryGetOneCheckpointHandler } from "./get-one";

export const queryCheckpointHandler: Provider[] = [
    QueryGetAllCheckpointHandler,
    QueryGetOneCheckpointHandler
]