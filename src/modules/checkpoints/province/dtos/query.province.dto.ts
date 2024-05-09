import { LanguageDto } from "src/common/dtos/language.dto";
import { Output, merge, object, optional, partial, string } from "valibot";

const QueryProvinceDto = merge([
    partial(LanguageDto),
    object({
        name: optional(string()),
    })
])

type QueryProvinceDtoType = Output<typeof QueryProvinceDto>;

export { QueryProvinceDto, QueryProvinceDtoType };