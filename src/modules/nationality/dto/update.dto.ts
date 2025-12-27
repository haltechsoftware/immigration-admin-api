import { Output, object } from 'valibot';
import { NationalityTranslateDto } from './translate.dto';

const UpdateNationalityDto = object({
  en: NationalityTranslateDto,
  lo: NationalityTranslateDto,
  zh_cn: NationalityTranslateDto,
});

type UpdateNationalityDtoType = Output<typeof UpdateNationalityDto>;

export { UpdateNationalityDto, UpdateNationalityDtoType };
