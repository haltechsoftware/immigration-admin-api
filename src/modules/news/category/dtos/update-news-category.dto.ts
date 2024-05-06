import { Output, object } from 'valibot';
import { NewCategoryTranslateDto } from './new_category_translate.dto';

const UpdateNewsCategoryDto = object({
  en: NewCategoryTranslateDto,
  lo: NewCategoryTranslateDto,
  zh_cn: NewCategoryTranslateDto,
});

type UpdateNewsCategoryDtoType = Output<typeof UpdateNewsCategoryDto>;

export { UpdateNewsCategoryDto, UpdateNewsCategoryDtoType };
