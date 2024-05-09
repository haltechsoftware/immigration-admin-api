import { Output, objectAsync} from "valibot";
import { CheckpointTranslateSchema } from "./checkpoint-category-translate.schema";

const UpdateCheckpointCategoryDto =
    objectAsync({
        lo: (CheckpointTranslateSchema),
        en: (CheckpointTranslateSchema),
        zh_cn: (CheckpointTranslateSchema)
    })


type UpdateCheckpointCategoryDtoType = Output<typeof UpdateCheckpointCategoryDto>;

export { UpdateCheckpointCategoryDto, UpdateCheckpointCategoryDtoType };