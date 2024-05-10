import { LanguageDto } from "src/common/dtos/language.dto";
import { Output, merge, object, optional, partial, string } from "valibot";

const QueryCheckpointDto = merge([
    partial(LanguageDto),
    object({
        name: optional(string()),
    })
])

type QueryCheckpointDtoType = Output<typeof QueryCheckpointDto>;

export { QueryCheckpointDto, QueryCheckpointDtoType };