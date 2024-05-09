import { LanguageDto } from "src/common/dtos/language.dto";
import { Output, merge, object, optional, partial, string } from "valibot";

const QueryCheckpointCategoryDto = merge([
    partial(LanguageDto),
    object({
        name: optional(string()),
    })
])

type QueryCheckpointCategoryDtoType = Output<typeof QueryCheckpointCategoryDto>;

export { QueryCheckpointCategoryDto, QueryCheckpointCategoryDtoType };