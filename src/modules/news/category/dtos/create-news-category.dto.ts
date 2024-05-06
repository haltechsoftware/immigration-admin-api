import { Output, object, omit } from 'valibot';
import { NewCategoryTranslateDto } from './new_category_translate.dto';

const CreateNewsCategoryDto = object({
  en: omit(NewCategoryTranslateDto, ['id']),
  lo: omit(NewCategoryTranslateDto, ['id']),
  zh_cn: omit(NewCategoryTranslateDto, ['id']),
});

type CreateNewsCategoryDtoType = Output<typeof CreateNewsCategoryDto>;

export { CreateNewsCategoryDto, CreateNewsCategoryDtoType };
