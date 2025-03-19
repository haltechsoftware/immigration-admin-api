import { Provider } from "@nestjs/common";
import { QueryGetAllCheckpointHandler } from "./get-all";
import { QueryGetOneCheckpointHandler } from "./get-one";
import { QueryGetAllCheckpointClientHandler } from "./get-all-client";
import { QueryGetAllProvinceCheckpointClientHandler } from "./get-all-province-checkpoint-client";
import { QueryGetAllClientCheckpointHandler } from "./get-all-client-checkpoint";
import { QueryGetOneClientCheckpointHandler } from "./get-one-by-client";
import { QueryGetAllCategoryClientHandler } from "./get-category-client";

export const queryCheckpointHandler: Provider[] = [
    QueryGetAllCheckpointHandler,
    QueryGetOneCheckpointHandler,
    QueryGetAllCategoryClientHandler,
    QueryGetAllCheckpointClientHandler,
    QueryGetAllClientCheckpointHandler,
    QueryGetOneClientCheckpointHandler,
    QueryGetAllProvinceCheckpointClientHandler,
]