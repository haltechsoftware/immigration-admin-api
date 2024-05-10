import { LanguageDto } from "src/common/dtos/language.dto";
import { Output, merge, object, optional, partial, string } from "valibot";

const QueryCountryDto = merge([
    partial(LanguageDto),
    object({
        name: optional(string()),
        is_except_visa: optional(string()),
    })
])

type QueryCountryDtoType = Output<typeof QueryCountryDto>;

export { QueryCountryDto, QueryCountryDtoType };