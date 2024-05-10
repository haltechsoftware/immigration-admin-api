import { Provider } from "@nestjs/common";
import { CreateCountryHandler } from "./create-country.handler";
import { UpdateCountryHandler } from "./update-country.handler";
import { DeleteCountryHandler } from "./delete.country.handler";

export const countryHandler : Provider[] = [
    CreateCountryHandler,
    UpdateCountryHandler,
    DeleteCountryHandler
]