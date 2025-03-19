import { Provider } from "@nestjs/common";
import { QueryGetAllCountryHandler } from "./get-all.country";
import { QueryGetOneCountryHandler } from "./get-one.country";
import { QueryGetAllClientCountryHandler } from "./get-all-to-client.country";

export const queryCountryHandler: Provider[] = [
    QueryGetAllCountryHandler,
    QueryGetOneCountryHandler,
    QueryGetAllClientCountryHandler,
]