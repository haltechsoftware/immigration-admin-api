import { Output, object, omit } from 'valibot';
import { NationalityTranslateDto } from './translate.dto';

const CreateNationalityDto = object({
  lo: omit(NationalityTranslateDto, ['id']),
  en: omit(NationalityTranslateDto, ['id']),
  zh_cn: omit(NationalityTranslateDto, ['id']),
});

type CreateNationalityDtoType = Output<typeof CreateNationalityDto>;

export { CreateNationalityDto, type CreateNationalityDtoType };
