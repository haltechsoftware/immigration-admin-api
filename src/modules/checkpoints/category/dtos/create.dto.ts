import { Output, object, omit } from 'valibot';
import { CheckpointTranslateDto } from './checkpoint-category-translate.dto';

const CreateCheckpointCategoryDto = object({
  lo: omit(CheckpointTranslateDto, ['id']),
  en: omit(CheckpointTranslateDto, ['id']),
  zh_cn: omit(CheckpointTranslateDto, ['id']),
});
type CreateCreateCheckpointCategoryDtoType = Output<
  typeof CreateCheckpointCategoryDto
>;

export { CreateCheckpointCategoryDto, CreateCreateCheckpointCategoryDtoType };
