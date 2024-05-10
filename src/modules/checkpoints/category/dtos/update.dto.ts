import { Output, object } from 'valibot';
import { CheckpointTranslateDto } from './checkpoint-category-translate.dto';

const UpdateCheckpointCategoryDto = object({
  lo: CheckpointTranslateDto,
  en: CheckpointTranslateDto,
  zh_cn: CheckpointTranslateDto,
});

type UpdateCheckpointCategoryDtoType = Output<
  typeof UpdateCheckpointCategoryDto
>;

export { UpdateCheckpointCategoryDto, UpdateCheckpointCategoryDtoType };
