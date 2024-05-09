import { Output, objectAsync, omitAsync, } from "valibot";
import { CheckpointTranslateSchema } from "./checkpoint-category-translate.schema";

const CreateCheckpointCategoryDto = objectAsync({
  lo: omitAsync(CheckpointTranslateSchema, ['id']),
  en: omitAsync(CheckpointTranslateSchema, ['id']),
  zh_cn: omitAsync(CheckpointTranslateSchema, ['id'])
})
type CreateCreateCheckpointCategoryDtoType = Output<typeof CreateCheckpointCategoryDto>;

export { CreateCheckpointCategoryDto, CreateCreateCheckpointCategoryDtoType };